"use client";
import React, { FC, useEffect, useState } from "react";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import StayCard2 from "@/components/StayCard2";
import Pagination from "@mui/material/Pagination";
import { createTheme, ThemeProvider } from "@mui/material";
import { imageset } from "@/utils/imgurlsetter";
import { fetchData } from "@/api/api";
import { Vendor } from "@/data/types";
import { useSearchParams } from "next/navigation";

export interface SectionGridFilterCardProps {
  className?: string;
}

interface VendorResponse {
  filterProducts: { products: Vendor[]; count: number };
}

const darkTheme = createTheme({
  palette: {
    // mode: "dark",
  },
});

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
}) => {
  const [page, setPage] = useState(1);
  const [pagecount, setPagecount] = useState(0);
  const [vdata, setVdata] = useState<Vendor[]>([]);
  const sq = useSearchParams();

  console.log(sq.get("categories"), sq.get("locations"));

  const formatQuery = (v: string | null) =>
    v ? decodeURIComponent(v).replace(/[-+]/g, " ").replace(/,/g, ", ") : "";

  const cat = sq.get("categories");
  const loc = sq.get("locations");
  const headerTitle =
    cat && loc ? `${formatQuery(cat)} in ${formatQuery(loc)}` : cat ? formatQuery(cat) : loc ? formatQuery(loc) : "";

  useEffect(() => {
    const loadVendor = async () => {
      const query = `
           query{
    filterProducts(page:${page},size:20,categories:"${
        sq.get("categories") || ""
      }",locations:"${sq.get("locations") || ""}") {
    products{
      id
      about
      address
      comCategory
      comImage
      image
      comLocation
      gallery
      included
      comName
      ratting
      title
      phone
      whatsApp
      category
      urlKey
    }
      count
    }
  }
          `;

      try {
        const data = await fetchData<VendorResponse>(query);
        //console.log("Vendors:", data?.getAllProducts?.products);
        if (data?.filterProducts?.products) {
          const vendordata = data?.filterProducts?.products;
          const formattedVendors = vendordata.map((vendordata) => {
            const temp = { ...vendordata };
            temp.image = imageset(temp.image as string);
            temp.comImage = imageset(temp.comImage as string);
            temp.galleryImgs = `${temp.gallery}`
              .split(",")
              .map((i) => imageset(i));
            temp.included = `${temp.included}`.split(",");
            temp.category = `${temp.category}`.split(",");
            temp.href = `/${temp.urlKey}`;
            return temp;
          });

          //console.log("formattedVendors:", formattedVendors);
          // console.log("p Count:", Math.ceil(data.getAllProducts.count / 20));
          setVdata(formattedVendors);
          setPagecount(Math.ceil(data.filterProducts.count / 20));
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadVendor();
  }, [page, sq]);

  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard"
    >
      <Heading2 />
<br/>
      <div className="mb-8 lg:mb-11">
        {headerTitle ? (
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold">{headerTitle}</h2>
            <p className="mt-2 text-sm text-neutral-500">Showing results for <span className="font-medium">{headerTitle}</span></p>
          </div>
        ) : null}
      </div>
      {/* <div className="mb-8 lg:mb-11">
        <TabFilters />
      </div> */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vdata?.map((stay) => (
          <StayCard2 key={stay.id} data={stay} />
        ))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        {/* <Pagination /> */}
        <ThemeProvider theme={darkTheme}>
          <Pagination
            count={pagecount}
            color="primary"
            onChange={(e, page) => {
              // console.log("pagination", page);
              setPage(page);
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default SectionGridFilterCard;
