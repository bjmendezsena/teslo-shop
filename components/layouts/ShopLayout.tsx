import { Typography } from "@mui/material";
import Head from "next/head";
import * as React from "react";
import { PropsWithChildren, FC } from "react";
import { Navbar, SideMenu } from "../ui";

interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullurl?: string;
  subTitle?: string;
  description?: string | JSX.Element | React.ReactNode | JSX.Element[];
}

export const ShopLayout: FC<Props> = ({
  pageDescription,
  title,
  imageFullurl,
  children,
  subTitle,
  description,
}) => {
  const renderDescription = () => {
    if (description) {
      if (typeof description === "string") {
        return (
          <Typography variant='h2' sx={{ mb: 1 }}>
            {description}
          </Typography>
        );
      }
      return description;
    }
    return null;
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={pageDescription} />
        <meta name='og:title' content={title} />
        <meta name='og:description' content={pageDescription} />
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
        />
        {imageFullurl && <meta name='og:image' content={imageFullurl} />}
      </Head>
      <nav>
        <Navbar />
      </nav>
      <SideMenu />

      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        <Typography variant='h1' component='h1'>
          {subTitle ? subTitle : "Tienda"}
        </Typography>

        {renderDescription()}
        {children}
      </main>
      {/* Footer */}
      <footer>{/* TYODO: Mi custom footer */}</footer>
    </>
  );
};
