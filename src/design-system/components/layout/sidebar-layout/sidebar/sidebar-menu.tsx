import { alpha, Box, Button, List, ListItem, styled } from "@mui/material"
import { NavLink as RouterLink } from "react-router-dom"

import {
  AccountCircleTwoTone,
  Calculate,
  CalendarViewDay,
  Category,
  CloudDownload,
  DateRange,
  DesktopWindowsOutlined,
  Group,
  InsertChart,
  Key,
  LocalActivity,
  Notes,
  OndemandVideo,
  PrecisionManufacturing,
  Redeem,
  Search,
  ShoppingCart,
  Star,
  Translate,
  VideoLabel,
  VideoLibrary,
  ViewList,
  Web,
  WebAsset,
} from "@mui/icons-material"

import { isMobile } from "react-device-detect"
import { sidebarToggleState } from "@/design-system/components/layout/sidebar.atom"
import { useRecoilState } from "recoil"
import useIsLoggedIn from "@/features/user/hooks/use-is-logged-in"

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`,
)

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create(["transform", "opacity"])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`,
)

const items = [
  {
    linkTo: "/popups",
    icon: <WebAsset />,
    label: "팝업 관리",
  },
  // {
  //   linkTo: "/popular-products",
  //   icon: <Redeem />,
  //   label: "많이 찾는 시술",
  // },
  // {
  //   linkTo: "/mainpage-products",
  //   icon: <DesktopWindowsOutlined />,
  //   label: "스페셜 이벤트 관리",
  // },
  {
    linkTo: "/most-popular",
    icon: <Star />,
    label: "가장 많이 찾는 시술 관리",
  },
  // {
  //   linkTo: "/staffs",
  //   icon: <Group />,
  //   label: "직원 관리",
  // },
  // {
  //   linkTo: "/equipments",
  //   icon: <PrecisionManufacturing />,
  //   label: "장비 관리",
  // },
  {
    linkTo: "/keywords",
    icon: <Search />,
    label: "추천 검색어 관리",
  },
  {
    linkTo: "/accounts",
    icon: <Key />,
    label: "관리자 계정 관리",
  },
  { label: "상품 관리" },
  {
    linkTo: "/products",
    label: "상품 목록",
    icon: <ShoppingCart />,
  },
  {
    linkTo: "/product-categories",
    label: "상품 대분류",
    icon: <Category />,
  },
  {
    linkTo: "/product-details",
    label: "상세페이지 관리",
    icon: <Web />,
  },
  {
    label: "이벤트 관리",
  },
  {
    linkTo: "/events",
    icon: <LocalActivity />,
    label: "이벤트 목록",
  },
  {
    linkTo: "/event-categories",
    icon: <Category />,
    label: "이벤트 대분류 관리",
  },
  {
    label: "예약 관리",
  },
  {
    linkTo: "/reservations",
    icon: <DateRange />,
    label: "예약 현황",
  },
  {
    linkTo: "/slot",
    icon: <CalendarViewDay />,
    label: "슬롯 인원 관리",
  },
  // {
  //   linkTo: "/crm-order",
  //   icon: <ViewList />,
  //   label: "대분류 우선순위 관리",
  // },
  {
    linkTo: "/crm",
    icon: <Category />,
    label: "CRM 대분류 관리",
  },
  {
    linkTo: "/lang-crm",
    icon: <Translate />,
    label: "언어별 우선순위 관리",
  },
]

function SidebarMenu() {
  const isLoggedIn = useIsLoggedIn()
  const [sidebarToggle, setSidebarToggle] = useRecoilState(sidebarToggleState)
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle)
  }
  const closeSidebar = () => {
    if (isMobile) {
      toggleSidebar()
    }
  }

  return (
    <MenuWrapper>
      <SubMenuWrapper>
        <List component="div">
          {items.map((item, i) => (
            <ListItem key={i} component="div">
              {item.linkTo ? (
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to={item.linkTo}
                  startIcon={item.icon}>
                  {item.label}
                </Button>
              ) : (
                <div tw="p-4">{item.label}</div>
              )}
            </ListItem>
          ))}
        </List>
      </SubMenuWrapper>
    </MenuWrapper>
  )
}

export default SidebarMenu
