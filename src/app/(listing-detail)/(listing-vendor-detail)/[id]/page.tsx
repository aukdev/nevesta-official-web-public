"use client";

import React, { FC, Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import CommentListing from "@/components/CommentListing";
import FiveStartIconForRate from "@/components/FiveStartIconForRate";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonSuccess from "@/shared/ButtonSuccess";
import ButtonClose from "@/shared/ButtonClose";
import Input from "@/shared/Input";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Amenities_demos, PHOTOS } from "./constant";
import StayDatesRangeInput from "./StayDatesRangeInput";
import GuestsInput from "./GuestsInput";
import SectionDateRange from "../../SectionDateRange";
import { Route } from "next";
import { fetchData } from "@/api/api";
import { imageset } from "@/utils/imgurlsetter";
import SocialsList from "@/shared/SocialsList";

export interface ListingStayDetailPageProps {
  params: { id: string };
}

interface Vendor {
  id: string;
  comName: string;
  about: string;
  address: string;
  comLocation: string;
  comCategory: string;
  comImage: string;
  gallery: string | string[];
  included: string | string[];
  sliderImages: string | string[];
  image: string;
  ratting: string | number;
  title: string;
  phone: string;
  urlKey: string;
  whatsApp: string;
  category: string | string[];
}

interface VendorResponse {
  getProduct: Vendor;
}

const initialVendor: Vendor = {
  id: "",
  comName: "",
  about: "",
  address: "",
  comLocation: "",
  comCategory: "",
  comImage: "",
  gallery: [],
  included: [],
  sliderImages: [],
  image: "",
  ratting: "0",
  title: "",
  phone: "",
  urlKey: "",
  whatsApp: "",
  category: [],
};

const ListingStayDetailPage: FC<ListingStayDetailPageProps> = ({ params }) => {
  //

  const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const [vdata, setVdata] = useState<Vendor>(initialVendor);

  const thisPathname = usePathname();
  const router = useRouter();
  const ratingValue = Number(vdata.ratting) || 0;
  const galleryItems: string[] = useMemo(
    () =>
      Array.isArray(vdata.gallery)
        ? vdata.gallery.filter((item): item is string => Boolean(item))
        : [],
    [vdata.gallery]
  );
  const galleryForModal = useMemo(
    () => galleryItems.map((url, idx) => ({ id: idx, url })),
    [galleryItems]
  );
  const galleryPayload = useMemo(
    () => JSON.stringify(galleryForModal),
    [galleryForModal]
  );
  const mainImage = galleryItems[0];

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }
  // console.log("param u", params.id);
  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  useEffect(() => {
    if (!galleryForModal.length || typeof window === "undefined") return;
    // console.log(galleryPayload);

    window.__listingVendorGallery = galleryForModal;
    sessionStorage.setItem("listingVendorGallery", galleryPayload);
  }, [galleryForModal, galleryPayload]);

  const handleOpenModalImageGallery = () => {
    if (galleryForModal.length > 0 && typeof window !== "undefined") {
      window.__listingVendorGallery = galleryForModal;
      sessionStorage.setItem("listingVendorGallery", galleryPayload);
    }
    router.push(`${thisPathname}?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  useEffect(() => {
    const loadVendor = async () => {
      const query = `
         query{
  getProduct(urlKey:"${params.id}"){
    id
    about
    address
    comCategory
    comImage
    image
    comLocation
    gallery
    sliderImages
    included
    comName
    ratting
    title
    phone
    whatsApp
    category
    urlKey
  }
}
        `;

      try {
        const data = await fetchData<VendorResponse>(query);
        // console.log("Vendors:", data.getProduct);
        if (data?.getProduct) {
          const vendordata = data.getProduct;

          vendordata.image = imageset(vendordata.image);
          vendordata.comImage = imageset(vendordata.comImage);
          vendordata.gallery = [
            ...`${vendordata.sliderImages}`.split(",").map((i) => imageset(i)),
            ...`${vendordata.gallery}`.split(",").map((i) => imageset(i)),
          ];
          vendordata.included = `${vendordata.included}`.split(",");
          vendordata.category = `${vendordata.category}`.split(",");
          // console.log("vendordata:", vendordata);
          setVdata(vendordata);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadVendor();
  }, []);

  // --- FIX WHATSAPP NO ---

  // const phoneNumber = vdata.phone;

  // let cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');

  // let formattedNumber = cleanNumber;

  // if (cleanNumber.startsWith('+94')) {
  //     let digits = cleanNumber.substring(3).replace(/\s/g, '');
  //     formattedNumber = `+94 ${digits}`;

  // } else if (cleanNumber.startsWith('94')) {
  //     let digits = cleanNumber.substring(2);
  //     formattedNumber = `+94 ${digits}`;

  // } else if (cleanNumber.startsWith('0')) {
  //     let digits = cleanNumber.substring(1);
  //     formattedNumber = `+94 ${digits}`;

  // } else if (cleanNumber.length === 9) {
  //     formattedNumber = `+94 ${cleanNumber}`;

  // }

  // --- FIX CONTACT NO ---
  const inputPhoneData = String(vdata.phone || "");
  const phoneNumbersArray = inputPhoneData.split(",");

  const formattedNumbers = phoneNumbersArray
    .map((phoneNumber) => {
      let cleanNumber = phoneNumber.trim().replace(/[^0-9+]/g, "");

      if (!cleanNumber) {
        return "";
      }

      let formattedNumber = cleanNumber;

      if (cleanNumber.startsWith("+94")) {
        let digits = cleanNumber.substring(3).replace(/\s/g, "");
        formattedNumber = `+94 ${digits}`;
      } else if (cleanNumber.startsWith("94")) {
        let digits = cleanNumber.substring(2);
        formattedNumber = `+94 ${digits}`;
      } else if (cleanNumber.startsWith("0")) {
        let digits = cleanNumber.substring(1);
        formattedNumber = `+94 ${digits}`;
      } else if (cleanNumber.length === 9) {
        formattedNumber = `+94 ${cleanNumber}`;
      }

      return formattedNumber;
    })
    .filter((n) => n)
    .join(", ");

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge name={vdata.comCategory} />
          <LikeSaveBtns />
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {vdata.comName}
        </h2>

        {/* 3 */}
        <div className="flex items-center space-x-4">
          <StartRating point={ratingValue} />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1">{vdata.comLocation}</span>
          </span>
        </div>

        {/* 4 */}
        {/* <div className="flex items-center">
          <Avatar hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Hosted by{" "}
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              Kevin Francis
            </span>
          </span>
        </div> */}

        {/* 5 */}
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />

        {/* 6 */}
        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          {Array.isArray(vdata.category) &&
            vdata.category.map((c, idx) => (
              <div key={`${c}-${idx}`} className="flex items-center space-x-3 ">
                <i className="las la-feather-alt text-2xl "></i>
                <span className="hidden sm:inline-block">{c}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Service information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300">
          <span>{vdata.about}</span>
        </div>
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Whats Included </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {` About the property's amenities and services`}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {Array.isArray(vdata?.included) &&
            vdata?.included
              ?.filter((_, i) => i < 6)
              .map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <i className={`text-3xl las la-check`}></i>
                  <span className=" ">{item}</span>
                </div>
              ))}
        </div>

        {/* ----- */}
        <div className="w-14 border-b border-neutral-200"></div>
        <div>
          <ButtonSecondary onClick={openModalAmenities}>
            View more 20 Includes
          </ButtonSecondary>
        </div>
        {renderMotalAmenities(vdata?.included as string[])}
      </div>
    );
  };

  const renderMotalAmenities = (included: string[]) => {
    return (
      <Transition appear show={isOpenModalAmenities} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-screen w-full max-w-4xl">
                <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="headlessui-dialog-title-70"
                    >
                      Whats Included
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalAmenities} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {included
                      ?.filter((_, i) => i < 1212)
                      .map((item) => (
                        <div
                          key={item}
                          className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8"
                        >
                          <i className={`text-4xl text-neutral-6000 las`}></i>
                          <span>{item}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Room Rates </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Prices may increase on weekends or holidays
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* CONTENT */}
        <div className="flow-root">
          <div className="text-sm sm:text-base text-neutral-6000 dark:text-neutral-300 -mb-4">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
              <span>Monday - Thursday</span>
              <span>$199</span>
            </div>
            <div className="p-4  flex justify-between items-center space-x-4 rounded-lg">
              <span>Monday - Thursday</span>
              <span>$199</span>
            </div>
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
              <span>Friday - Sunday</span>
              <span>$219</span>
            </div>
            <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
              <span>Rent by month</span>
              <span>-8.34 %</span>
            </div>
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
              <span>Minimum number of nights</span>
              <span>1 night</span>
            </div>
            <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
              <span>Max number of nights</span>
              <span>90 nights</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* host */}
        <div className="flex items-center space-x-4">
          <Avatar
            hasChecked
            hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
            sizeClass="h-20 w-20"
            radius="rounded-full"
            //imgUrl={vdata.image?`${imageset(vdata.image)}?auto=compress&cs=tinysrgb&dpr=2&h=750&width=1260`:"https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&width=1260"}
            imgUrl={vdata?.comImage}
            //item.image?`${imageset(item.image)}?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`:"https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          />
          <div>
            <a className="block text-xl font-medium" href="##">
              {vdata.comName}
            </a>
            <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <StartRating point={ratingValue} />
              {/* <span className="mx-2">·</span>
              <span> 12 places</span> */}
            </div>
          </div>
        </div>

        {/* desc */}
        <span className="block text-neutral-6000 dark:text-neutral-300">
          {vdata.title}
        </span>

        {/* info */}
        <div className="block text-neutral-500 dark:text-neutral-400 space-y-2.5">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{formattedNumbers}</span>
            {/* <span>{vdata.phone}</span> */}
          </div>
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="currentColor"
            >
              <path d="M12.04 2.83c-5.83 0-10.57 4.74-10.57 10.57 0 1.96.53 3.82 1.54 5.44l-1.3 4.75 4.88-1.28c1.58.87 3.39 1.36 5.25 1.36 5.83 0 10.57-4.74 10.57-10.57 0-5.83-4.74-10.57-10.57-10.57zm.05 18.04c-1.63 0-3.15-.45-4.48-1.24l-.32-.19-3.32.87.89-3.23-.21-.34c-.81-1.32-1.26-2.83-1.26-4.42 0-4.8 3.9-8.7 8.7-8.7s8.7 3.9 8.7 8.7-3.9 8.7-8.7 8.7zM17.43 14.4c-.21-.11-.79-.39-.92-.43-.14-.05-.24-.07-.35.07-.11.14-.43.43-.53.54-.11.11-.21.12-.4.04-.19-.08-.79-.29-1.5-1.02-.55-.58-.92-1.3-.98-1.4-.07-.11-.01-.17.06-.28.06-.11.14-.29.21-.43.07-.14.07-.26.04-.34-.03-.08-.35-.85-.48-1.16-.14-.3-.29-.26-.4-.26-.11 0-.24-.02-.34-.02-.11 0-.29.04-.43.16-.14.11-.53.52-.53 1.29s.54 1.49.62 1.59c.08.11 1.05 1.7 2.54 2.37.38.17.68.27.91.35.37.14.71.12.98.07.3-.06.79-.32.9-.63.11-.31.11-.58.07-.63-.04-.05-.14-.08-.29-.16z" />
            </svg>
            <span>{vdata.whatsApp}</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span>{vdata.address}</span>
          </div>
        </div>

        {/* == */}
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <ButtonSecondary href="/author">See host profile</ButtonSecondary>
        </div>
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Reviews (23 reviews)</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Content */}
        <div className="space-y-5">
          <FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
          <div className="relative">
            <Input
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Share your thoughts ..."
            />
            <ButtonCircle
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size=" w-12 h-12 "
            >
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </div>
        </div>

        {/* comment */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <div className="pt-8">
            <ButtonSecondary>View more 20 reviews</ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            San Diego, CA, United States of America (SAN-San Diego Intl.)
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* MAP */}
        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3 ring-1 ring-black/10 rounded-xl z-0">
          <div className="rounded-xl overflow-hidden z-0">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY&q=Eiffel+Tower,Paris+France"
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Things to know</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Cancellation policy</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Refund 50% of the booking value when customers cancel the room
            within 48 hours after successful booking and 14 days before the
            check-in time. <br />
            Then, cancel the room 14 days before the check-in time, get a 50%
            refund of the total amount paid (minus the service fee).
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Check-in time</h4>
          <div className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-md text-sm sm:text-base">
            <div className="flex space-x-10 justify-between p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <span>Check-in</span>
              <span>08:00 am - 12:00 am</span>
            </div>
            <div className="flex space-x-10 justify-between p-3">
              <span>Check-out</span>
              <span>02:00 pm - 04:00 pm</span>
            </div>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Special Note</h4>
          <div className="prose sm:prose">
            <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
              <li>
                Ban and I will work together to keep the landscape and
                environment green and clean by not littering, not using
                stimulants and respecting people around.
              </li>
              <li>Do not sing karaoke past 11:30</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebarold = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* PRICE */}
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            {vdata.comName}
            {/* <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /night
            </span> */}
          </span>
          <StartRating point={ratingValue} />
        </div>

        {/* FORM */}
        {/* <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl ">
          <StayDatesRangeInput className="flex-1 z-[11]" />
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInput className="flex-1" />
        </form> */}

        {/* SUM */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Contact No:</span>
            <span>{formattedNumbers}</span>
          </div>
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{vdata.address}</span>
            {/* <span>$199</span> */}
          </div>
        </div>

        {/* SUBMIT */}
        <ButtonPrimary href={`https://wa.me/${vdata.whatsApp}`}>
          Send Whatsapp
        </ButtonPrimary>
      </div>
    );
  };
  const renderSidebar = () => {
    return (
      <div className=" w-full flex flex-col items-center text-center sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8">
        <Avatar
          hasChecked
          hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
          sizeClass="h-20 w-20"
          radius="rounded-full"
          imgUrl={vdata?.comImage}
        />

        {/* ---- */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <h2 className="text-3xl font-semibold"> {vdata.comName}</h2>
          <StartRating className="!text-base" point={ratingValue} />
        </div>

        {/* ---- */}
        <p className="text-neutral-500 dark:text-neutral-400">{vdata.title}</p>

        {/* ---- */}
        <SocialsList
          className="!space-x-3"
          itemClass="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl"
        />
        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{formattedNumbers}</span>
        </div>
        {/* <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="currentColor"
            >
              <path d="M12.04 2.83c-5.83 0-10.57 4.74-10.57 10.57 0 1.96.53 3.82 1.54 5.44l-1.3 4.75 4.88-1.28c1.58.87 3.39 1.36 5.25 1.36 5.83 0 10.57-4.74 10.57-10.57 0-5.83-4.74-10.57-10.57-10.57zm.05 18.04c-1.63 0-3.15-.45-4.48-1.24l-.32-.19-3.32.87.89-3.23-.21-.34c-.81-1.32-1.26-2.83-1.26-4.42 0-4.8 3.9-8.7 8.7-8.7s8.7 3.9 8.7 8.7-3.9 8.7-8.7 8.7zM17.43 14.4c-.21-.11-.79-.39-.92-.43-.14-.05-.24-.07-.35.07-.11.14-.43.43-.53.54-.11.11-.21.12-.4.04-.19-.08-.79-.29-1.5-1.02-.55-.58-.92-1.3-.98-1.4-.07-.11-.01-.17.06-.28.06-.11.14-.29.21-.43.07-.14.07-.26.04-.34-.03-.08-.35-.85-.48-1.16-.14-.3-.29-.26-.4-.26-.11 0-.24-.02-.34-.02-.11 0-.29.04-.43.16-.14.11-.53.52-.53 1.29s.54 1.49.62 1.59c.08.11 1.05 1.7 2.54 2.37.38.17.68.27.91.35.37.14.71.12.98.07.3-.06.79-.32.9-.63.11-.31.11-.58.07-.63-.04-.05-.14-.08-.29-.16z" />
            </svg>
            <span>{vdata.whatsApp}</span>
          </div> */}
        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <span>{vdata.address}</span>
        </div>
        {/* ---- */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 w-14"></div>

        {/* ---- */}
        <ButtonSuccess href={`https://wa.me/${vdata.whatsApp}`}>
          Send Whatsapp
        </ButtonSuccess>
      </div>
    );
  };
  return (
    <div className="nc-ListingStayDetailPage">
      {/*  HEADER */}
      {!!mainImage && (
        <header className="rounded-md sm:rounded-xl">
          <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
            <div
              className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={handleOpenModalImageGallery}
            >
              <Image
                fill
                className="object-cover rounded-md sm:rounded-xl"
                src={mainImage}
                alt={vdata.comName || "Gallery image"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
            {galleryItems
              .filter((_, i) => i >= 1 && i < 5)
              .map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className={`relative rounded-md sm:rounded-xl overflow-hidden ${
                    index >= 3 ? "hidden sm:block" : ""
                  }`}
                >
                  <div className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5">
                    <Image
                      fill
                      className="object-cover rounded-md sm:rounded-xl "
                      src={item}
                      alt={vdata.comName || "Gallery image"}
                      sizes="400px"
                    />
                  </div>

                  {/* OVERLAY */}
                  <div
                    className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={handleOpenModalImageGallery}
                  />
                </div>
              ))}

            <button
              className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 z-10"
              onClick={handleOpenModalImageGallery}
            >
              <Squares2X2Icon className="w-5 h-5" />
              <span className="ml-2 text-neutral-800 text-sm font-medium">
                Show all photos
              </span>
            </button>
          </div>
        </header>
      )}

      {/* MAIN */}
      <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {/* {renderSection4()} */}
          {/* <SectionDateRange /> */}
          {renderSection5()}
          {/* {renderSection6()} */}
          {/* {renderSection7()} */}
          {/* {renderSection8()} */}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>
    </div>
  );
};

export default ListingStayDetailPage;
