"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { Vendor } from "@/data/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import HeaderFilter from "./HeaderFilter";
import StayCard2 from "./StayCard2";
import { fetchData } from "@/api/api";
import { imageset } from "@/utils/imgurlsetter";

//
export interface SectionGridFeaturePlacesProps {
  stayListings?: Vendor[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  cardType?: "card1" | "card2";
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  gridClass = "",
  heading = "Easily Find Wedding Vendors Island Wide",
  subHeading = "Your all-in-one directory to find, compare, and connect with every professional needed for your perfect day.",
  tabs = ["Colombo", "Galle", "Kandy", "Matara"],
}) => {
  const renderCard = (stay: Vendor) => {
    let CardName = StayCard2;

    return <CardName key={stay.id} data={stay} />;
  };

  const [vendorsdata, setvendorsdata] = useState<Vendor[]>([]);

  interface CategoriesResponse {
    getAllProducts: { products: Vendor[] };
  }
  useEffect(() => {
    const loadVendors = async () => {
      const query = `
        query{
  getAllProducts(page:1,size:16){
    products{
      id
      title
      sliderImages
      image
      comLocation
      comCategory
      ratting
      comName
      urlKey
    }
  }
}
      `;

      try {
        const data = await fetchData<CategoriesResponse>(query);
        // console.log("Vendors:", data.getAllProducts.products);
        if (data?.getAllProducts) {
          if (Array.isArray(data.getAllProducts.products)) {
            const vendors = data.getAllProducts.products;
            const formatvendors = vendors.map((item) => {
              return {
                id: item.id,
                authorId: 10,
                date: "May 20, 2021",
                href: `/${item.urlKey}`,
                listingCategoryId: 17,
                comName: item.comName,
                featuredImage: imageset(item.image as string),
                galleryImgs: `${item.sliderImages}`
                  .split(",")
                  .map((i) => imageset(i)),
                commentCount: 70,
                viewCount: 602,
                like: false,
                comLocation: item.comLocation,
                ratting: item.ratting,
                reviewCount: 28,
                comCategory: item.comCategory,
                maxGuests: 6,
                bedrooms: 10,
                bathrooms: 3,
                saleOff: "-10% today",
                isAds: null,
                map: { lat: 55.2094559, lng: 61.5594641 },
              };
            });
            setvendorsdata(formatvendors);
            //console.log("formatvendors", formatvendors);
          }
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadVendors();
  }, []);

  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={"Colombo"}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
      />
      <div
        className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {vendorsdata.map((stay) => renderCard(stay))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary loading>Show me more</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionGridFeaturePlaces;
