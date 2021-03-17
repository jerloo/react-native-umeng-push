export interface NumbersType {
  readingNumber: number;
  totalNumber: number;
  uploadedNumber: number;
}

export interface AttachmentDbItem {
  bookId?: number;
  custId?: number;
  readTimes?: number;
  billMonth?: number;
  uploaded?: boolean;
  url?: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  fileSource?: number;
  isRemove?: boolean;
}

export interface BookAttachmentsTotal {
  total: number;
  uploaded: number;
}
