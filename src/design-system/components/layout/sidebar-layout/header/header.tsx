import {
  alpha,
  Box,
  Divider,
  IconButton,
  lighten,
  Stack,
  styled,
  Tooltip,
  useTheme,
} from "@mui/material"
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone"
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone"
import { useRecoilState } from "recoil"
import useIsLoggedIn from "@/features/user/hooks/use-is-logged-in"
import { sidebarToggleState } from "@/design-system/components/layout/sidebar.atom"
import { LoginIcon24dp, MyIcon24dp } from "@/assets/icons/24dp"
import { useLogout } from "@/features/auth/hooks/use-auth"
import { useNavigate } from "react-router-dom"
import { Icon } from "@/design-system/components"
import HeaderUserbox from "./user-box"

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme?.header.background ?? "", 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`,
)

const LoginOrUserIcon: React.FC = () => {
  const navigate = useNavigate()
  const isLogin = useIsLoggedIn()
  const { logout } = useLogout()

  return (
    <IconButton
      onClick={
        isLogin
          ? () => {
              logout()
              navigate("/")
            }
          : () => navigate("/login")
      }>
      <Icon icon={isLogin ? MyIcon24dp : LoginIcon24dp} />
    </IconButton>
  )
}

function Header() {
  const isLogin = useIsLoggedIn()
  const [sidebarToggle, setSidebarToggle] = useRecoilState(sidebarToggleState)
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle)
  }
  const theme = useTheme()

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 1px 0 ${alpha(
                lighten(theme.colors.primary.main, 0.7),
                0.15,
              )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
                theme.colors.alpha.black[100],
                0.2,
              )}, 0px 5px 22px -4px ${alpha(theme.colors.alpha.black[100], 0.1)}`,
      }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        alignItems="center"
        spacing={2}
      />
      <Box display="flex" alignItems="center">
        {isLogin ? <HeaderUserbox /> : <LoginOrUserIcon />}
        <Box
          component="span"
          sx={{
            ml: 2,
            display: { lg: "none", xs: "inline-block" },
          }}>
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize="small" />
              ) : (
                <CloseTwoToneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  )
}

export default Header
