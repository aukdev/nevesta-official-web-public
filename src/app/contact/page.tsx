import React, { FC } from "react";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import SocialsList from "@/shared/SocialsList";
import Label from "@/components/Label";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface PageContactProps {}

const PageContact: FC<PageContactProps> = ({}) => {
  return (
    <div className={`nc-PageContact overflow-hidden`}>
      <div className="bg-gradient-to-r from-pink-50 to-white dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 text-center">
            Get in touch with Nevesta
          </h1>
          <p className="text-center mt-4 text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Whether you have a question about our services, need help finding a vendor, or want to partner with us — we’re here to help.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto -mt-12">
        <div className="bg-white dark:bg-slate-900 shadow-lg rounded-xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Contact information</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">Reach out via email, phone, or the contact form. We typically respond within 1 business day.</p>

            <div className="space-y-4">
              <div>
                <h4 className="uppercase text-xs text-neutral-400 tracking-wide">Address</h4>
                <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">Anagarika Dharmapala Mawatha, Matara, Sri Lanka</div>
              </div>

              <div>
                <h4 className="uppercase text-xs text-neutral-400 tracking-wide">Email</h4>
                <a href="mailto:support@nevesta.com" className="mt-1 block text-sm text-neutral-700 dark:text-neutral-300">support@nevesta.com</a>
              </div>

              <div>
                <h4 className="uppercase text-xs text-neutral-400 tracking-wide">Phone</h4>
                <a href="" className="mt-1 block text-sm text-neutral-700 dark:text-neutral-300">+94 74 045 0684 / +94 71 530 9560</a>
              </div>
            </div>

            <div>
              <h4 className="uppercase text-xs text-neutral-400 tracking-wide">Follow us</h4>
              <div className="mt-3">
                <SocialsList />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-neutral-50 dark:bg-slate-800 rounded-lg p-6 md:p-8">
              <form className="grid grid-cols-1 gap-4" action="#" method="post">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label>
                    <Label>Full name</Label>
                    <Input placeholder="Your name" className="mt-1" />
                  </label>

                  <label>
                    <Label>Email address</Label>
                    <Input placeholder="you@example.com" type="email" className="mt-1" />
                  </label>
                </div>

                <label>
                  <Label>Subject</Label>
                  <Input placeholder="Subject" className="mt-1" />
                </label>

                <label>
                  <Label>Message</Label>
                  <Textarea rows={6} className="mt-1" />
                </label>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-neutral-500">All messages are private and secure.</span>
                  <ButtonPrimary type="submit">Send Message</ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* OTHER SECTIONS */}
      <div className="container">
        <SectionSubscribe2 className="pb-24 lg:pb-32" />
      </div>
    </div>
  );
};

export default PageContact;
