import { PdaMeterBookDto } from '../../apiclient/src/models';

interface PdaMeterBookDtoHolder {
  item: PdaMeterBookDto;
  checked: boolean;
  downloaded: boolean;
}

export default PdaMeterBookDtoHolder;
