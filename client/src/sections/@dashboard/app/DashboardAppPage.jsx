import { Helmet } from "react-helmet-async";
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Typography } from "@mui/material";
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary } from "./index";
import { useAuth } from "../../../hooks/useAuth";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Library | Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{mb: 5}}>
          Hi {user.name.split(' ')[0]}, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Books" total={22} icon={'solar:book-bold'}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Users" total={4} color="info" icon={'mdi:user'}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Returned Today" total={10} color="warning" icon={'carbon:return'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Borrowed Today" total={30} color="error" icon={'ph:hand-fill'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2023',
                '02/02/2023',
                '03/03/2023',
                '04/04/2023',
                '05/05/2023',
                '06/06/2023',
                '07/07/2023',
                '08/08/2023',
                '09/09/2023',
                '10/10/2023',
                '11/11/2023',
              ]}
              chartData={[
                {
                  name: 'K16',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'K17',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'K18',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'Ha Noi', value: 4344 },
                { label: 'TP HCM', value: 5435 },
                { label: 'Da Nang', value: 1954 },
                { label: 'Can Tho', value: 2349 },
                { label: 'Quy Nhon', value: 3836 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.success.main,
              ]}
            />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}