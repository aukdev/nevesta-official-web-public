"use client";
import CardCategoryBox1 from "@/components/CardCategoryBox1";
import Heading from "@/shared/Heading";
import { TaxonomyType } from "@/data/types";
import React, { useEffect, useState } from "react";
import { fetchData } from "@/api/api";
import { imageset } from "@/utils/imgurlsetter";

export interface SectionGridCategoryBoxProps {
  categories?: TaxonomyType[];
  headingCenter?: boolean;
  categoryCardType?: "card1";
  className?: string;
  gridClassName?: string;
}

const SectionGridCategoryBox: React.FC<SectionGridCategoryBoxProps> = ({
  categoryCardType = "card1",
  headingCenter = true,
  className = "",
  gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => {
  let CardComponentName = CardCategoryBox1;
  switch (categoryCardType) {
    case "card1":
      CardComponentName = CardCategoryBox1;
      break;

    default:
      CardComponentName = CardCategoryBox1;
  }
  const [locationsdata, setlocationsdata] = useState<Location[]>([]);

  interface Location {
    id: string;
    title?: string;
    itemCount: number;
    href: string;
    name: string;
    taxonomy: string;
    count?: number;
    thumbnail: string;
    image?: string;
  }
  interface LocationsResponse {
    getAllLocation: Location[];
  }

  useEffect(() => {
    const loadLocations = async () => {
      const query = `
          query{
    getAllLocation{
        id
        title
        image
        itemCount
    }
  }
        `;

      try {
        const data = await fetchData<LocationsResponse>(query);

        if (data?.getAllLocation) {
          if (Array.isArray(data.getAllLocation)) {
            let locations = data.getAllLocation;

            locations = locations.sort((a, b) => {
              return b.itemCount - a.itemCount;
            });

            const formatlocations = locations.map((item) => {
              return {
                ...item,
                id: "8",
                href: `/search?locations=${item.title}`,
                name: item.title || "",
                taxonomy: "category",
                count: item.itemCount,
                thumbnail: item.image
                  ? `${imageset(
                      item.image
                    )}?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
                  : "https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=750",
              };
            });
            setlocationsdata(formatlocations);
          }
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadLocations();
  }, []);

  return (
    <div className={`nc-SectionGridCategoryBox relative ${className}`}>
      <Heading
        desc="Discover great services near where you live"
        isCenter={headingCenter}
      >
        Explore nearby
      </Heading>
      <div className={`grid ${gridClassName} gap-5 sm:gap-6 md:gap-8`}>
        {}
        {locationsdata.map((item, i) => (
          <CardComponentName key={i} taxonomy={item as TaxonomyType} />
        ))}
      </div>
    </div>
  );
};

export default SectionGridCategoryBox;
