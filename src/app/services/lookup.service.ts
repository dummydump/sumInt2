import { Injectable } from '@angular/core';

export class LookupItem {
    Name: string;
    Value: string;
}

@Injectable()
export class LookupService {
    getAgentList(): string[] {
        return [];
    }
}
