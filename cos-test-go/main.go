package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	"github.com/levigross/grequests"
	"github.com/tencentyun/cos-go-sdk-v5"
)

type Credentials struct {
	Token        string
	TmpSecretId  string
	TmpSecretKey string
}

type SignResponse struct {
	Credentials *Credentials
	ExpiredTime int
	Expiration  *time.Time
	RequestId   string
	StartTime   int
}

func main() {
	signUrl := "http://fileservice.yuncloudtech.cn/api/app/files/tempSecretKey?FileSource=2&Bucket=shyuntechtest&Prefix="
	signRes, err := grequests.Get(signUrl, &grequests.RequestOptions{
		Headers: map[string]string{
			"Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Im40UXNfTDduT2s4TTg3M0lzM1FOZ2ciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE2MTkxOTQwNDksImV4cCI6MTY1MDczMDA0OSwiaXNzIjoiaHR0cDovL2lkNC55dW5jbG91ZHRlY2guY24iLCJhdWQiOlsiQml6Q2hhcmdlU3lzdGVtIiwiRmlsZVNlcnZpY2UiLCJNb2JpbGVSZWFkU2VydmljZSJdLCJjbGllbnRfaWQiOiJNZXRlclJlYWRpbmdfQXBwIiwic3ViIjoiMzlmOTE1NDUtNzQ1Ni1iMWI3LWY2YTYtNzIxOWI0MmIxOGZiIiwiYXV0aF90aW1lIjoxNjE5MTk0MDQ5LCJpZHAiOiJsb2NhbCIsInRlbmFudGlkIjoiMzlmOTE1M2UtYzVkMC02ODQzLTRhNTUtZTQxYTM5ZTg5MjIxIiwicm9sZSI6WyLmioTooajlkZgiLCLlgqzotLnlkZgiLCLmjaLooajlkZgiXSwicGhvbmVfbnVtYmVyIjoiMTg4MjUyNTI1MjUiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOlsiRmFsc2UiLGZhbHNlXSwiZW1haWwiOiJ5eXNmQHNoeXVudGVjaC5jb20iLCJlbWFpbF92ZXJpZmllZCI6WyJGYWxzZSIsZmFsc2VdLCJuYW1lIjoibWFscCIsInNjb3BlIjpbIkJpekNoYXJnZVN5c3RlbSIsIkZpbGVTZXJ2aWNlIiwiTW9iaWxlUmVhZFNlcnZpY2UiXSwiYW1yIjpbInB3ZCJdfQ.V7rtieCpTRIkfOhqrycqddc_fWGyiwk_VR6YHua1jRdUNyNa4PHiuSPV8ICxWgRLLW1R4JZYAgzenv_IlyqHmN8EpuYWyPQim7613FHOYZ_RPRDgS8VcbQa4NPFBzn2AM5ZKzeU2cCY008H8n5KWEfV_1Xb4Z5srE_Yi3csFFUFbNElbGRf8MxnXKnwuuFnIzPuXqY-nY89uovnSS9gy9ZMVTTDubEjiJOzO0gwN5SW1ewsN7LOJ3e5H6UDI4JcD58jaujA-i5u6UlPa4PdNTIUFDyZSZP_mGvOSZsjIfmmn9sR4PSx4WSAzVx8bgGhbbRrYxhf2QvIsn2VpDPCAbw",
		},
	})
	if err != nil {
		panic(err)
	}
	signResult := &SignResponse{}
	err = signRes.JSON(signResult)
	if err != nil {
		panic(err)
	}
	//将<bucket>和<region>修改为真实的信息
	//bucket的命名规则为{name}-{appid} ，此处填写的存储桶名称必须为此格式
	u, _ := url.Parse("https://shyuntechtest-1259078701.cos.ap-shanghai.myqcloud.com")
	b := &cos.BaseURL{BucketURL: u}
	c := cos.NewClient(b, &http.Client{
		//设置超时时间
		Timeout: 100 * time.Second,
		Transport: &cos.AuthorizationTransport{
			//如实填写账号和密钥，也可以设置为环境变量
			SessionToken: signResult.Credentials.Token,
			SecretID:     signResult.Credentials.TmpSecretId,
			SecretKey:    signResult.Credentials.TmpSecretKey,
		},
	})

	for {
		name := "hello.txt"
		result, resp, err := c.Object.Upload(context.Background(), name, name, nil)
		if err != nil {
			panic(err)
		}
		fmt.Println(result.Key)
		fmt.Println(result.Location)
		bs, _ := ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		fmt.Printf("%s\n", string(bs))

		fmt.Println("等待1s下一次上传")
		time.Sleep(time.Second * 5)

	}

}
