import React, { FC } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSuccess from "@/shared/ButtonSuccess";

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 lg:pb-64 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl !leading-[114%] ">
            Sri Lanka&apos;s #1 Wedding App
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            Nevesta.lk is a wedding planning platform in Sri Lanka, connecting
            couples with wedding vendors. It allows users to find and contact
            vendors across various categories to plan their wedding.
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonPrimary
              href="https://play.google.com/store/apps/details?id=com.nevesta.android"
              sizeClass="px-5 py-4 sm:px-7"
            >
              Download Mobile App
            </ButtonPrimary>
            <ButtonSuccess
              href="https://admin.nevesta.lk"
              sizeClass="px-5 py-4 sm:px-7"
            >
              Register as a Vendor
            </ButtonSuccess>
          </div>
        </div>
        <div className="flex-grow">
          <Image className="w-full" src={imagePng} alt="hero" priority />
        </div>
      </div>

      <div className="hidden lg:block z-10 mb-12 lg:mb-0 lg:-mt-40 w-full">
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default SectionHero;
