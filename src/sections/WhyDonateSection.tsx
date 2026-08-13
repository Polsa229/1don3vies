import { useState } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { Play, Heart, Users, Activity } from 'lucide-react';

const VIDEO_ID = '0aJ5x93pAvU';
const VIDEO_START = 10;
const VIDEO_END = 120;

export function WhyDonateSection() {
  const { t, lang } = useI18n();
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section id="why" className="relative py-24 lg:py-32 overflow-hidden">
      <InkBlot
        variant={1}
        color="#6B1F35"
        className="absolute -bottom-40 -right-32 w-[500px] h-[700px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="why.eyebrow"
          titleKey="why.title"
          subtitleKey="why.subtitle"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="text-center bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-6">
            <div className="w-12 h-12 rounded-full bg-bordeaux-50 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-bordeaux-600" fill="currentColor" />
            </div>
            <p className="font-display text-3xl text-bordeaux-900">1</p>
            <p className="text-sm text-warmgray-500 mt-1">
              {t('why.stats.donations')} <span className="font-bold text-bordeaux-700">3</span> {t('why.stats.lives')}
            </p>
          </div>
          <div className="text-center bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-6">
            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-accent-600" />
            </div>
            <p className="font-display text-3xl text-bordeaux-900">{t('why.stats.dailyValue')}</p>
            <p className="text-sm text-warmgray-500 mt-1">{t('why.stats.daily')}</p>
          </div>
          <div className="text-center bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-6">
            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-success-600" />
            </div>
            <p className="font-display text-3xl text-bordeaux-900">100%</p>
            <p className="text-sm text-warmgray-500 mt-1">
              {lang === 'fr' ? 'Sécurité du matériel à usage unique' : 'Single-use equipment safety'}
            </p>
          </div>
        </div>

        {/* Body text */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-base sm:text-lg text-warmgray-600 leading-relaxed">
            {t('why.body')}
          </p>
        </div>

        {/* Video + summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Video (lite embed) */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl shadow-bordeaux-900/10 group">
            {videoLoaded ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?start=${VIDEO_START}&end=${VIDEO_END}&autoplay=1`}
                title="Blood donation diversity video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                onClick={() => setVideoLoaded(true)}
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-bordeaux-800 via-plum-900 to-bordeaux-900"
                aria-label={t('why.video.play')}
              >
                {/* Thumbnail overlay */}
                <div className="absolute inset-0 opacity-20">
                  <InkBlot variant={3} color="#FFEDD0" className="absolute top-0 right-0 w-48 h-64" />
                  <InkBlot variant={4} color="#FFC070" className="absolute bottom-0 left-0 w-40 h-52" />
                </div>

                {/* Play button */}
                <div className="relative z-10 flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
                  <div className="w-16 h-16 rounded-full bg-ivory-50/90 flex items-center justify-center shadow-2xl">
                    <Play className="w-7 h-7 text-bordeaux-700 ml-1" fill="currentColor" />
                  </div>
                  <span className="text-sm font-medium text-ivory-50/80">{t('why.video.play')}</span>
                </div>
              </button>
            )}
          </div>

          {/* Text summary for accessibility */}
          <div className="bg-ivory-100 rounded-2xl p-6 sm:p-8 border border-warmgray-200/50">
            <h3 className="font-display text-lg text-bordeaux-900 mb-3">
              {lang === 'fr' ? 'Résumé de la vidéo' : 'Video summary'}
            </h3>
            <p className="text-sm text-warmgray-600 leading-relaxed">
              {t('why.video.summary')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
