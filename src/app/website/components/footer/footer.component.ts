import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, NgOptimizedImage],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  contactInfo = [
    {
      icon: 'fa-solid fa-phone',
      title: 'Contact',
      detail: '07762 279442',
      href: 'tel:+447762279442',
    },
    {
      icon: 'fa-solid fa-envelope',
      title: 'Email',
      detail: 'contact@cradlereproductivehealth.com',
      href: 'mailto:contact@cradlereproductivehealth.com',
    },
    {
      icon: 'fa-solid fa-location-dot',
      title: 'Location',
      detail: `St Bartholomew's Hospital \n Nuffield Health Hospital`,
      href: '#',
    },
  ];

  quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Your Journey', href: '/journey' },
    { label: 'Services', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
    // { label: 'FAQs', href: '/faq' },
  ];

  treatments = [
    { label: 'OI', href: '/treatments/oi' },
    { label: 'Embryo freezing', href: '/treatments/embryo-freezing' },
    { label: 'Male Fertility Assessment', href: '/treatments/male-fertility-assessment' },
    { label: 'Female Fertility Assessment', href: '/treatments/female-fertility-assessment' },
    { label: 'Early Pregnancy Scans', href: '/treatments/early-pregnancy-scans' },
    // { label: 'Donor Programs', href: '/treatments/donor-programmes' },
  ];

  certifications = [
    {
      icon: 'fa-solid fa-award',
      title: 'HFEA Licensed',
      sub: 'Regulated UK Authority',
    },
    {
      icon: 'fa-solid fa-notes-medical',
      title: 'CQC Registered',
      sub: 'Care Quality Commission',
    },
    {
      icon: 'fa-solid fa-star',
      title: '98% Success Rate',
      sub: 'Nationally Recognised',
    },
  ];

  socials = [
    { icon: 'fab fa-facebook-f', href: '#' },
    { icon: 'fab fa-instagram', href: '#' },
    { icon: 'fab fa-twitter', href: '#' },
    { icon: 'fab fa-linkedin-in', href: '#' },
  ];
}
