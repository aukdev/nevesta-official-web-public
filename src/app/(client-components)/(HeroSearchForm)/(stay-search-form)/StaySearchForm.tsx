"use client";
import React, { FC, useState } from "react";
import LocationInput from "../LocationInput";
import GuestsInput from "../GuestsInput";
import StayDatesRangeInput from "./StayDatesRangeInput";
import TabFilters from "@/app/(stay-listings)/TabFilters";

const StaySearchForm: FC<{}> = ({}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const renderForm = () => {
    return (
      <>
        <form
          className="w-full relative mt-8 flex rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setIsFilterOpen(true);
          }}
        >
          <LocationInput className="flex-[1.5]" />
          <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>

          <GuestsInput className="flex-1" />
        </form>

        <TabFilters
          externalControl={true}
          isExternalOpen={isFilterOpen}
          onExternalClose={() => setIsFilterOpen(false)}
        />
      </>
    );
  };

  return renderForm();
};

export default StaySearchForm;
