import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeUrlPipe', () => {
  it('create an instance', () => {
    const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    const pipe = new SafeUrlPipe(sanitizerSpy);
    expect(pipe).toBeTruthy();
  });
});
