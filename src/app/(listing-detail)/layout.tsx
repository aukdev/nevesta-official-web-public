"use client";

import BackgroundSection from "@/components/BackgroundSection";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";
import MobileFooterSticky from "./(components)/MobileFooterSticky";
import { imageGallery as listingStayImageGallery } from "./(listing-vendor-detail)/[id]/constant";
import { imageGallery as listingCarImageGallery } from "./listing-car-detail/constant";
import { imageGallery as listingExperienceImageGallery } from "./listing-experiences-detail/constant";
import { Route } from "next";
import type { ListingGalleryImage } from "@/components/listing-image-gallery/utils/types";

const normalizeGallery = (input: unknown): ListingGalleryImage[] => {
  if (!Array.isArray(input)) return [];

  return input
    .map((item, idx) => {
      if (typeof item === "string" && item) {
        return { id: idx, url: item };
      }
      if (item && typeof item === "object" && "url" in item) {
        const { url, id } = item as { url?: unknown; id?: unknown };
        if (typeof url === "string" && url) {
          return { id: typeof id === "number" ? id : idx, url };
        }
      }
      return null;
    })
    .filter(Boolean) as ListingGalleryImage[];
};

declare global {
  interface Window {
    __listingVendorGallery?: ListingGalleryImage[];
  }
}

const readVendorGallery = (): ListingGalleryImage[] => {
  // console.log("hi");

  if (typeof window === "undefined") return [];

  const fromMemory = normalizeGallery(window.__listingVendorGallery);
  if (fromMemory.length) return fromMemory;

  const stored = sessionStorage.getItem("listingVendorGallery");
  console.log(stored);

  if (stored) {
    try {
      const parsed = normalizeGallery(JSON.parse(stored));
      if (parsed.length) return parsed;
    } catch (e) {
      console.warn("Failed to parse listingVendorGallery", e);
    }
  }

  return [];
};

const DetailtLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const thisPathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}?${params.toString()}` as Route);
  };

  const getImageGalleryListing = () => {
    // console.log("eeeee", thisPathname);
    const vendorGallery = readVendorGallery();
    if (vendorGallery.length) return vendorGallery;

    if (thisPathname?.includes("/listing-vendor-detail")) {
      return listingStayImageGallery;
    }
    if (thisPathname?.includes("/listing-car-detail")) {
      return listingCarImageGallery;
    }
    if (thisPathname?.includes("/listing-experiences-detail")) {
      return listingExperienceImageGallery;
    }

    return [];
  };

  return (
    <div className="ListingDetailPage">
      <ListingImageGallery
        isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
        onClose={handleCloseModalImageGallery}
        images={getImageGalleryListing()}
      />

      <div className="ListingDetailPage__content">{children}</div>
      {/* <div className="container ListingDetailPage__content">{children}</div> */}

      {/* OTHER SECTION */}
      {/* <div className="container py-24 lg:py-32">
        <div className="relative py-16">
          <BackgroundSection />
          <SectionSliderNewCategories
            heading="Explore by types of stays"
            subHeading="Explore houses based on 10 types of stays"
            categoryCardType="card5"
            itemPerRow={5}
            sliderStyle="style2"
          />
        </div>
        <SectionSubscribe2 className="pt-24 lg:pt-32" />
      </div> */}
      <br />

      {/* STICKY FOOTER MOBILE */}
      <MobileFooterSticky />
    </div>
  );
};

export default DetailtLayout;
