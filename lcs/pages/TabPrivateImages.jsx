import { attach } from '../../shared/pages/Page';
import TabImagePage from './TabImagePage';

class C extends TabImagePage {
  isPublicImage() {
    return false;
  }
}

export default attach(C);
