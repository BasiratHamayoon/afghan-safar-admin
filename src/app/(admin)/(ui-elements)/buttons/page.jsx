import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { BoxIcon } from "@/icons";

export const metadata = {
  title: "Buttons | Afghan Safar Admin",
  description: "Buttons component showcase for Afghan Safar Admin Panel",
};

export default function Buttons() {
  return (
    <div>
      {/* Page Header Breadcrumb */}
      <PageBreadcrumb pageTitle="Buttons" />

      <div className="space-y-5 sm:space-y-6">
        {/* 1. Primary Buttons Section */}
        <ComponentCard title="Primary Button">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary">
              Button Text
            </Button>
            <Button size="md" variant="primary">
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* 2. Primary Buttons with Leading (Left) Icon */}
        <ComponentCard title="Primary Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" startIcon={<BoxIcon />}>
              Button Text
            </Button>
            <Button size="md" variant="primary" startIcon={<BoxIcon />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* 3. Primary Buttons with Trailing (Right) Icon */}
        <ComponentCard title="Primary Button with Right Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" endIcon={<BoxIcon />}>
              Button Text
            </Button>
            <Button size="md" variant="primary" endIcon={<BoxIcon />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* 4. Outline (Secondary) Buttons Section */}
        <ComponentCard title="Secondary Button">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline">
              Button Text
            </Button>
            <Button size="md" variant="outline">
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* 5. Outline Buttons with Leading (Left) Icon */}
        <ComponentCard title="Outline Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline" startIcon={<BoxIcon />}>
              Button Text
            </Button>
            <Button size="md" variant="outline" startIcon={<BoxIcon />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>

        {/* 6. Outline Buttons with Trailing (Right) Icon */}
        <ComponentCard title="Outline Button with Right Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline" endIcon={<BoxIcon />}>
              Button Text
            </Button>
            <Button size="md" variant="outline" endIcon={<BoxIcon />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}