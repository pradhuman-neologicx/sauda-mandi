import {
  Component,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  viewChild
} from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

export interface Testimonial {
  badge?: string;
  text: string;
  stars: number;
  doctor: string;

}

@Component({
    selector: 'app-testimonials',
    templateUrl: './testimonials.component.html',
    styleUrls: ['./testimonials.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  readonly swiperRef = viewChild.required<ElementRef>('swiperRef');

  activeIndex = 0;

  swiperConfig = {
    loop: true,
    spaceBetween: 24,
    centeredSlides: false, // OFF — cards must not be clipped
    grabCursor: true,
    speed: 650,
    autoplay: {
      delay: 3800,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 }, // mobile  → 1 full card
      640: { slidesPerView: 2 }, // tablet  → 2 full cards
      1024: { slidesPerView: 3 }, // desktop → 3 full cards
    },
  };

  testimonials: Testimonial[] = [
    {
      doctor: 'Dr Sheetal Barhate',
      badge: 'Fertility Treatment',
      stars: 5,
      text: 'We reached out to Sheetal for our third round of IVF, we felt like she really took the time to understand our history and tailored our treatment to support us in the best way. Throughout the whole process she’s been very flexible and reassuring, and she has been very kind and approachable. We’re really grateful for the care and support she’s shown us.',
    },
    {
      doctor: 'Dr Jyotsna Pundir',
      badge: 'In-Vitro Fertilisation (IVF)',
      stars: 5,
      text: "Dr Pundir has been my IVF doctor for over a year - she's been amazing and I felt she had my back even during the hardest times. She's always very responsive and gives options and suggestions when things do not go to plan. Thank you!!",
    },
    {
      doctor: 'Dr Jyotsna Pundir',
      badge: 'Intracytoplasmic Sperm Injections (ICSI)',
      stars: 5,
      text: 'I had my treatment with Ms. Jyotsna Pundir, and she truly has an amazing personality. She treats her patients with such empathy and care, as if she is addressing her own concerns. To me, she is an angel on earth. I sincerely wish her good health so she can continue helping and healing many more people.',
    },
    {
      doctor: 'Dr Sheetal Barhate',
      badge: 'Fertility Treatment',
      stars: 5,
      text: 'Dr Sheetal is soo caring and lovely. She listened to all my issues and gave me the best plan, within few weeks my treatment started, And currently i am 2 months pregnant. We are soo greatful for your help and we will be back again in future. Thank you!',
    },
    {
      doctor: 'Dr Sheetal Barhate',
      badge: 'In-Vitro Fertilisation (IVF)',
      stars: 5,
      text: 'Dr Barhate provided exceptional care throughout my frozen embryo transfer journey. She was knowledgeable, compassionate, and always took the time to answer my questions, making me feel supported every step of the way. Her expertise in female fertility and IVF gave me confidence throughout the process, and I am incredibly grateful for her care.',
    },
    {
      doctor: 'Dr Jyotsna Pundir',
      badge: 'Long-Term IVF Care',
      stars: 4.7,
      text: 'Dr Pundir has been my IVF doctor for over a year. She is responsive, understanding, and always provides helpful guidance.',
    },
    {
      doctor: 'Dr Sheetal Barhate',
      badge: 'Egg Collections and Transfers',
      stars: 5,
      text: 'We had the pleasure of meeting Dr Sheetal for a second time for our embryo transfer. As before, she was professional and explained exactly what was happening. She also said to let her know if any point I wanted to stop, or felt pain. Throughout the whole process, which can be emotional, Dr Sheetal explained what was happening, for example when they were getting the embryo, when they were checking the catheter.',
    },
    {
      doctor: 'Dr Jyotsna Pundir',
      badge: 'Egg Collections and Transfers',
      stars: 5,
      text: 'My egg freezing journey was very positive. Dr Pundir, is fantastic, she made me feel at ease at all times and was always there to support me during every step of my journey. My outcome was also great thanks to her. I highly recommend Dr Pundir, not only is she professional and knowledgeable but a very nice and warm person!',
    },
    {
      doctor: 'Dr Jyotsna Pundir',
      badge: 'Menopause',
      stars: 5,
      text: "My appointment was reassuring due to Ms Pundir's vastly knowledgable and professional approach. Amazing to be regarded as an individual rather than a case, which ensures the treatment and advice are properly targeted and effective.",
    },
    {
      doctor: 'Dr Sheetal Barhate',
      badge: 'Frozen Embryo Transfer (FET)',
      stars: 5,
      text: 'Before I went to Dr Sheetal someone in the health team mentioned Dr Sheetal being very good. They were right. She is very professional and helpful with advice and questions but also flexible and accommodating your needs. Thank you Dr.',
    }
  ];
  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      const swiperEl = this.swiperRef()?.nativeElement;
      if (!swiperEl) return;

      Object.assign(swiperEl, this.swiperConfig);
      swiperEl.initialize();

      requestAnimationFrame(() => {
        swiperEl.style.opacity = '1';
      });

      swiperEl.addEventListener('slidechange', (e: any) => {
        const swiper = (e.target as any).swiper;
        if (swiper) this.activeIndex = swiper.realIndex;
      });
    });
  }

  ngOnDestroy(): void {
    const swiperEl = this.swiperRef()?.nativeElement;
    if (swiperEl?.swiper) {
      swiperEl.swiper.destroy(true, true);
    }
  }

  slide(dir: number): void {
    const swiper = this.swiperRef()?.nativeElement?.swiper;
    if (!swiper) return;
    dir > 0 ? swiper.slideNext() : swiper.slidePrev();
  }

  goToSlide(index: number): void {
    const swiper = this.swiperRef()?.nativeElement?.swiper;
    if (!swiper) return;
    swiper.slideToLoop(index);
    this.activeIndex = index;
  }

  getStarFill(rating: number, starIndex: number): number {
    if (rating >= starIndex) {
      return 100;
    } else if (rating <= starIndex - 1) {
      return 0;
    } else {
      return (rating - (starIndex - 1)) * 100;
    }
  }
}
