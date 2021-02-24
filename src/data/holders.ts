import { PdaMeterBookDto, PdaReadDataDto } from '../../apiclient/src/models';

export interface PdaMeterBookDtoHolder {
  item: PdaMeterBookDto;
  checked: boolean;
  downloaded: boolean;
}

export interface PdaReadDataDtoHolder {
  item: PdaReadDataDto;
  showExtra: boolean;
}
