import { NavLink, useLocation } from "react-router-dom";
import formatTitle from "../libs/formateTitle";
import { Icon } from "@iconify/react";

export default function Topbar({ isMobile = false }) {
  const location = useLocation();

  const Title = formatTitle(location.pathname);

  const notfication = [];

  return (
    <div className="flex justify-between items-center w-full">
      {!isMobile && <h4 className="text-3xl font-semibold">{Title}</h4>}

      <div className="flex items-center justify-center gap-4 md:gap-6">
        <div className="relative">
          {notfication.length !== 0 && (
            <div className="text-[12px] px-1.5 rounded-full bg-red-500 inline-flex absolute -top-1 right-0">
              {notfication.length}
            </div>
          )}
          <NavLink to={"/notifications"}>
            <Icon
              icon={
                location.pathname === "/notifications"
                  ? "si:notifications-fill"
                  : "si:notifications-line"
              }
              width={isMobile ? 24 : 32}
              height={isMobile ? 24 : 32}
            />
          </NavLink>
        </div>

        <div className={`bg-[url('/profile.jpg')] bg-cover bg-center rounded-full ${isMobile ? 'w-10 h-10' : 'w-16 h-16'}`}>

        </div>
      </div>
    </div>
  );
}
