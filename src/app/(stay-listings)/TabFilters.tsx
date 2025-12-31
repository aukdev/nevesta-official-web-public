"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, Popover, Transition } from "@headlessui/react";
import NcInputNumber from "@/components/NcInputNumber";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/Checkbox";
import Slider from "rc-slider";
import convertNumbThousand from "@/utils/convertNumbThousand";
import { fetchData } from "@/api/api";
import SectionHero from "../(server-components)/SectionHero";

// DEMO DATA

const moreFilter2 = [
  { name: "Banquet Halls" },
  { name: "Honeymoon Hotels" },
  { name: "Photo Location" },
  { name: "Flora" },
  { name: "Bridal Dresses" },
  { name: "Photography" },
];

interface Location {
  id: string;
  title: string;
  itemCount: number;
  name: string;
  count: number;
}
interface LocationsResponse {
  getAllLocation: Location[];
}
interface Category {
  id: string;
  title: string;
  image: string;
  count: number;
}
interface CategorysResponse {
  getSortedCategories: Category[];
}

interface IFilterData {
  id: string;
  name: string;
  count: number;
}

interface TabFiltersProps {
  externalControl?: boolean;
  isExternalOpen?: boolean;
  onExternalClose?: () => void;
}

const TabFilters: React.FC<TabFiltersProps> = ({
  externalControl = false,
  isExternalOpen = false,
  onExternalClose,
}) => {
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [isOpenMoreFilterMobile, setisOpenMoreFilterMobile] = useState(false);
  const [rangePrices, setRangePrices] = useState([0, 1000]);
  const [locationsdata, setlocationsdata] = useState<IFilterData[]>([]);
  const [categoriesdata, setcategoriesdata] = useState<IFilterData[]>([]);

  // External control logic
  const isModalOpen = externalControl ? isExternalOpen : isOpenMoreFilter;
  const closeModal = externalControl
    ? () => onExternalClose?.()
    : () => setisOpenMoreFilter(false);
  const openModal = externalControl
    ? () => {} // No-op when externally controlled
    : () => setisOpenMoreFilter(true);

  //
  const closeModalMoreFilterMobile = () => setisOpenMoreFilterMobile(false);
  const openModalMoreFilterMobile = () => setisOpenMoreFilterMobile(true);

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
        //console.log("Loccations:", data.getAllLocation);

        if (data?.getAllLocation) {
          if (Array.isArray(data.getAllLocation)) {
            let locations = data.getAllLocation;

            locations = locations.sort((a, b) => {
              return b.itemCount - a.itemCount;
            });

            const formatlocations = locations.map((item) => {
              return {
                id: item.id,
                name: item.title,
                count: item.itemCount,
              };
            });

            //console.log("formatlocations:", formatlocations);
            setlocationsdata(formatlocations);
          }
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    const loadCategories = async () => {
      const query = `
         query {
          getSortedCategories {
            id
            title
            image
            count
          }
        }
        `;

      try {
        const data = await fetchData<CategorysResponse>(query);
        console.log("CategorysResponse:", data.getSortedCategories);

        if (data?.getSortedCategories) {
          if (Array.isArray(data.getSortedCategories)) {
            let locations = data.getSortedCategories;

            locations = locations.sort((a, b) => {
              return b.count - a.count;
            });

            const formatcategories = locations.map((item) => {
              return {
                id: item.id,
                name: item.title,
                count: item.count,
              };
            });

            //console.log("formatlocations:", formatlocations);
            setcategoriesdata(formatcategories);
          }
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
    loadLocations();
  }, []);

  const renderTabMoreFilter = () => {
    return (
      <div>
        {!externalControl && (
          <div
            className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none cursor-pointer`}
            onClick={openModal}
          >
            <span>Category & Location Filters</span>
            {renderXClear()}
          </div>
        )}

        <DesktopFilterModal
          isOpenMoreFilter={isModalOpen}
          closeModalMoreFilter={closeModal}
          locationsdata={locationsdata}
          categoriesdata={categoriesdata}
        />
      </div>
    );
  };

  const renderTabMoreFilterMobile = () => {
    return (
      <div>
        <div
          className={`flex lg:hidden items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none cursor-pointer`}
          onClick={openModalMoreFilterMobile}
        >
          <span>Category & Location Filters aaa</span>
          {renderXClear()}
        </div>

        <MobileFilterModal
          isOpenMoreFilterMobile={isOpenMoreFilterMobile}
          closeModalMoreFilterMobile={closeModalMoreFilterMobile}
          categoriesdata={categoriesdata}
          locationsdata={locationsdata}
        />
      </div>
    );
  };

  return (
    <div className="flex lg:space-x-4">
      {/* {renderTabMoreFilter()} */}
      <div className="hidden lg:flex space-x-4">{renderTabMoreFilter()}</div>
      {/* <SectionHero className="pt-10 lg:pt-16 lg:pb-16" /> */}
      {renderTabMoreFilterMobile()}
    </div>
  );
};

export default TabFilters;

const renderXClear = () => {
  return (
    <span className="w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
};

const renderMoreFilterItem = (
  data: {
    name: string;
    defaultChecked?: boolean;
  }[]
) => {
  const list1 = data.filter((_, i) => i < data.length / 2);
  const list2 = data.filter((_, i) => i >= data.length / 2);
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col space-y-5">
        {list1.map((item) => (
          <Checkbox
            key={item.name}
            name={item.name}
            label={item.name}
            defaultChecked={!!item.defaultChecked}
          />
        ))}
      </div>
      <div className="flex flex-col space-y-5">
        {list2.map((item) => (
          <Checkbox
            key={item.name}
            name={item.name}
            label={item.name}
            defaultChecked={!!item.defaultChecked}
          />
        ))}
      </div>
    </div>
  );
};

interface IDesktopFilterModal {
  isOpenMoreFilter: boolean;
  closeModalMoreFilter: () => void;
  locationsdata: IFilterData[];
  categoriesdata: IFilterData[];
}

const DesktopFilterModal = ({
  isOpenMoreFilter,
  closeModalMoreFilter,
  locationsdata,
  categoriesdata,
}: IDesktopFilterModal) => {
  const router = useRouter();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isOpenMoreFilter) {
      setSelectedLocations([]);
      setSelectedCategories([]);
    }
  }, [isOpenMoreFilter]);

  const handleLocationChange = (name: string, checked: boolean) => {
    setSelectedLocations((prev) =>
      checked ? [...prev, name] : prev.filter((item) => item !== name)
    );
  };

  const handleCategoryChange = (name: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, name] : prev.filter((item) => item !== name)
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","));
    }

    if (selectedLocations.length > 0) {
      params.append("locations", selectedLocations.join(","));
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? "?" + queryString : ""}`);
    closeModalMoreFilter();
  };

  const renderMoreFilterItemWithChange = (
    data: {
      name: string;
      defaultChecked?: boolean;
    }[],
    onChange: (name: string, checked: boolean) => void
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);
    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col space-y-5">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
              onChange={(checked) => onChange(item.name, checked)}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-5">
          {list2.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
              onChange={(checked) => onChange(item.name, checked)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Transition appear show={isOpenMoreFilter} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModalMoreFilter}
      >
        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            className="inline-block py-8 px-2 h-screen w-full max-w-4xl"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
              <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  More filters
                </Dialog.Title>
                <span className="absolute left-3 top-3">
                  <ButtonClose onClick={closeModalMoreFilter} />
                </span>
              </div>

              <div className="flex-grow overflow-y-auto">
                <div className="px-10 divide-y divide-neutral-200 dark:divide-neutral-800">
                  <div className="py-7">
                    <h3 className="text-xl font-medium">Locations</h3>
                    <div className="mt-6 relative ">
                      {renderMoreFilterItemWithChange(
                        locationsdata,
                        handleLocationChange
                      )}
                    </div>
                  </div>
                  <div className="py-7">
                    <h3 className="text-xl font-medium">Categories</h3>
                    <div className="mt-6 relative ">
                      {renderMoreFilterItemWithChange(
                        categoriesdata,
                        handleCategoryChange
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                <ButtonThird
                  onClick={closeModalMoreFilter}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Clear
                </ButtonThird>
                <ButtonPrimary
                  onClick={handleApply}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Apply
                </ButtonPrimary>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

interface IMobileFilterModal {
  isOpenMoreFilterMobile: boolean;
  closeModalMoreFilterMobile: () => void;
  locationsdata: IFilterData[];
  categoriesdata: IFilterData[];
}

const MobileFilterModal = ({
  isOpenMoreFilterMobile,
  closeModalMoreFilterMobile,
  locationsdata,
  categoriesdata,
}: IMobileFilterModal) => {
  const router = useRouter();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isOpenMoreFilterMobile) {
      setSelectedLocations([]);
      setSelectedCategories([]);
    }
  }, [isOpenMoreFilterMobile]);

  const handleLocationChange = (name: string, checked: boolean) => {
    setSelectedLocations((prev) =>
      checked ? [...prev, name] : prev.filter((item) => item !== name)
    );
  };

  const handleCategoryChange = (name: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, name] : prev.filter((item) => item !== name)
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","));
    }

    if (selectedLocations.length > 0) {
      params.append("locations", selectedLocations.join(","));
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? "?" + queryString : ""}`);
    closeModalMoreFilterMobile();
  };

  const renderMoreFilterItemWithChange = (
    data: {
      name: string;
      defaultChecked?: boolean;
    }[],
    onChange: (name: string, checked: boolean) => void
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);
    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col space-y-5">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
              onChange={(checked) => onChange(item.name, checked)}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-5">
          {list2.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
              onChange={(checked) => onChange(item.name, checked)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Transition appear show={isOpenMoreFilterMobile} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModalMoreFilterMobile}
      >
        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            className="inline-block py-8 px-2 h-screen w-full max-w-4xl"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
              <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  More filters
                </Dialog.Title>
                <span className="absolute left-3 top-3">
                  <ButtonClose onClick={closeModalMoreFilterMobile} />
                </span>
              </div>

              <div className="flex-grow overflow-y-auto">
                <div className="px-4 sm:px-6 divide-y divide-neutral-200 dark:divide-neutral-800">
                  <div className="py-7">
                    <h3 className="text-xl font-medium">Locations</h3>
                    <div className="mt-6 relative ">
                      {renderMoreFilterItemWithChange(
                        locationsdata,
                        handleLocationChange
                      )}
                    </div>
                  </div>

                  {/* ---- */}
                  <div className="py-7">
                    <h3 className="text-xl font-medium">Categories</h3>
                    <div className="mt-6 relative ">
                      {renderMoreFilterItemWithChange(
                        categoriesdata,
                        handleCategoryChange
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                <ButtonThird
                  onClick={closeModalMoreFilterMobile}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Clear
                </ButtonThird>
                <ButtonPrimary
                  onClick={handleApply}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Apply
                </ButtonPrimary>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
