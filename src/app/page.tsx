import React from "react";
import SectionHero from "@/app/(server-components)/SectionHero";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionGridFeaturePlaces from "@/components/SectionGridFeaturePlaces";
import SectionGridCategoryBox from "@/components/SectionGridCategoryBox";
import ThemeToggleTopRight from "@/components/ThemeToggleTopRight";

function PageHome() {
  return (
    <main className="nc-PageHome relative overflow-hidden">
      <ThemeToggleTopRight />
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="container relative space-y-24 mb-24 lg:space-y-28 lg:mb-28">
        {/* SECTION HERO */}
        <SectionHero className="pt-10 lg:pt-16 lg:pb-16" />

        {/* SECTION 1 */}
        <SectionSliderNewCategories />

        {/* <SectionOurFeatures /> */}

        <SectionGridFeaturePlaces cardType="card2" />

        {/* <SectionHowItWork /> */}

        {/* <div className="relative py-16">
          <BackgroundSection className="bg-orange-50 dark:bg-black/20" />
          <SectionSliderNewCategories
            categories={DEMO_CATS_2}
            categoryCardType="card4"
            itemPerRow={4}
            heading="Suggestions for discoveryq"
            subHeading="Popular places to stay that Chisfis recommends for you"
            sliderStyle="style2"
          />
        </div> */}

        {/* <SectionSubscribe2 /> */}

        {/* <div className="relative py-16">
          <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20 " />
          <SectionGridAuthorBox />
        </div> */}

        <SectionGridCategoryBox />

        {/* <div className="relative py-16">
          <BackgroundSection />
          <SectionBecomeAnAuthor />
        </div> */}

        {/* <SectionSliderNewCategories
          heading="Explore by types of stays"
          subHeading="Explore houses based on 10 types of stays"
          categoryCardType="card5"
          itemPerRow={5}
        /> */}

        {/* <SectionVideos /> */}

        {/* <div className="relative py-16">
          <BackgroundSection />
          <SectionClientSay />
        </div> */}
      </div>
    </main>
  );
}

export default PageHome;
