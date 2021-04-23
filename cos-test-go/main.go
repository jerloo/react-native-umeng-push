package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	"github.com/tencentyun/cos-go-sdk-v5"
)

func main() {
	//将<bucket>和<region>修改为真实的信息
	//bucket的命名规则为{name}-{appid} ，此处填写的存储桶名称必须为此格式
	u, _ := url.Parse("https://shyuntechtest-1259078701.cos.ap-shanghai.myqcloud.com")
	b := &cos.BaseURL{BucketURL: u}
	c := cos.NewClient(b, &http.Client{
		//设置超时时间
		Timeout: 100 * time.Second,
		Transport: &cos.AuthorizationTransport{
			//如实填写账号和密钥，也可以设置为环境变量
			SessionToken: "gtxz6L5bQnVeXXb85N2GSMJiaAf6PnAa47e98257192a3eee20c0e5c32878f1a1ZqhlG9CPVSAIUzahpsHW2usD2Zmt8ZWwPIMvGrle8ywm_jUNaaqPCx2efmH8cYfq3gwc8Z6NCrQpLwgAg_qLnSQwwDKI3EXpumhrXc1EonLK1OsGT-VtjOoB3-EXI5RdbG1fPYk2MpLOd20zCfHDGcR-6fYQbqt0PuwSREv_nptbi8BSU8UXI1NJD8lkOxUIR38L5hhlGiJOV-PuIaCnOs3ca1OJSpLpG2H7hj97ALkRw34siYaqvH9tJbM0byeLXPVNtAlyabFXWSvfl5IsHqsdk78FzCaozATcuzCLhbXmUbOxTmDGR3BDnElQYoL75SDiHSaiynHdWJrcjQml1vQrhHR6HYXcFfuU7xB4QYbZM3CmIkUqj10M3vdUA1Uj35h4AYHSwO6FBdmJh_N0wFW0cwkYKEZNV3hEjXCMT_yIa74Lfy8vA89die56FC9QNUK_K8PGxBjch7mO-Mjr1tFvTF3Hf_1RMJNjH0Dlc9on8RbZS4OUKiXKez7Azx-yB1AddkgtrjXZVDBKU3sMud67Bpqrfq_PLfVjyZZLPJzJJlFG5VP8_5-EvZdZ-ZqW0EDvMns8eeMQyWlc7pOQE5sR6vXu2m6L2WS9pVAdSy1pukNbrbL3FpaFi5wPvdTqj270ajV8Tuu2Zbvc70nUtg-MyKEWlbd7ryZ4iOO0OD4",
			SecretID:     "AKIDUDja28dfbYLK-TSbFLQ6mp57kak8Qgbnm7Ygdr5H-kMrr4KAQmK6S-FneN56MyRY",
			SecretKey:    "M8mtJipb5EvrM1vmxAgDDGgh5ZWpH7EqOPSpQBwIrNM=",
		},
	})

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
}
