import {
    DomSanitizer,
    SafeHtml,
    SafeResourceUrl,
    SafeScript,
    SafeStyle,
    SafeUrl,
    SafeValue
} from '@angular/platform-browser';
import { Injectable, SecurityContext } from '@angular/core';

@Injectable()
export class DomSanitizerMock extends DomSanitizer {
    bypassSecurityTrustUrl(value: string): SafeUrl {
        return 'some url';
    }

    bypassSecurityTrustHtml(value: string): SafeHtml {
        return 'some html';
    }

    bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl {
        return 'trust url';
    }

    bypassSecurityTrustScript(value: string): SafeScript {
        return 'trust script';
    }

    bypassSecurityTrustStyle(value: string): SafeStyle {
        return 'trust style';
    }

    sanitize(context: SecurityContext, value: SafeValue | string | null): string | null;

    sanitize(context: SecurityContext, value: {} | string | null): string | null;

    sanitize(context: SecurityContext, value: SafeValue | string | null | {}): string | null {
        return 'sanitized';
    }
}
