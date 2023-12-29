import styled from "@emotion/styled";
import { darken, lighten } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .super-app-theme--error': {
        backgroundColor: getBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getHoverBackgroundColor(
            theme.palette.error.main,
            theme.palette.mode,
          ),
        },
        '&.Mui-selected': {
          backgroundColor: getSelectedBackgroundColor(
            theme.palette.error.main,
            theme.palette.mode,
          ),
          '&:hover': {
            backgroundColor: getSelectedHoverBackgroundColor(
              theme.palette.error.main,
              theme.palette.mode,
            ),
          },
        },
    },
    '& .super-app-theme--success': {
      backgroundColor: getBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.success.main,
            theme.palette.mode,
        ),
        },
        }
    }
}))

export default StyledDataGrid;