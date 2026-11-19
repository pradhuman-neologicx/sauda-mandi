import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-loginpages',
    standalone: true,
    templateUrl: './loginpages.component.html',
    styleUrl: './loginpages.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, NgOptimizedImage]
})
export class LoginpagesComponent {

}
