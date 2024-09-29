import { Button } from "@/components/ui/button";
import SideNavLayout from "../../layouts/SideNavLayout";
import { SideNavItemType } from "./types";

interface SideNavProps {
  SideNavItems: SideNavItemType[];
  SideNavCloseFn: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ SideNavCloseFn, SideNavItems }) => {
  return (
    <SideNavLayout sideNavTitle="This is the side nav title">
      <div>Hi I'm the sidenav content</div>
      <Button className="bg-purple-500" onClick={SideNavCloseFn}>
        Close me
      </Button>
      <div className="flex flex-col gap-3">
        {SideNavItems.map((item, index) => {
          return (
            <a className="text-red-400" key={index} href={item.ItemHref}>
              {item.ItemTitle}
            </a>
          );
        })}
      </div>
    </SideNavLayout>
  );
};

export default SideNav;
