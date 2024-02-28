'use client';

import { formatter } from '@/lib/utils';

import { Playfair, Playfair_Display_SC } from 'next/font/google';
import React from 'react';

interface ProgramEmailTemplateProps {
  name: string;
  link: string;
}

const playfair = Playfair({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
});

const playfair_sc = Playfair_Display_SC({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
});

export const ProgramEmailTemplate: React.FC<
  Readonly<ProgramEmailTemplateProps>
> = ({ name, link }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        margin: 0,
        padding: 0,
        textSizeAdjust: 'none',
        WebkitTextSizeAdjust: 'none',
      }}
    >
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        className="nl-container"
        role="presentation"
        style={{ backgroundColor: '#FFFFFF' }}
        width={'100%'}
      >
        <tbody>
          <tr>
            <td>
              <table
                align="center"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                className="row row-1"
                role="presentation"
                width={'100%'}
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        className="row-content stack"
                        role="presentation"
                        style={{
                          color: '#000000',
                          width: '500px',
                          margin: '0 auto',
                        }}
                        width={500}
                      >
                        <tbody>
                          <tr>
                            <td
                              className="column column-1"
                              style={{
                                fontWeight: '400',
                                textAlign: 'left',
                                paddingBottom: '5px',
                                paddingTop: '5px',
                                verticalAlign: 'top',
                                borderTop: '0px',
                                borderRight: '0px',
                                borderBottom: '0px',
                                borderLeft: '0px',
                              }}
                              width={33.34}
                            >
                              <table
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                className="empty_block block-1"
                                role="presentation"
                                width={'100%'}
                              >
                                <tr>
                                  <td className="pad">
                                    <div></div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              className="column column-2"
                              style={{
                                fontWeight: '400',
                                textAlign: 'left',
                                paddingBottom: '5px',
                                paddingTop: '5px',
                                verticalAlign: 'top',
                                borderTop: '0px',
                                borderRight: '0px',
                                borderBottom: '0px',
                                borderLeft: '0px',
                              }}
                              width={33.34}
                            >
                              <table
                                border={0}
                                cellPadding="0"
                                cellSpacing="0"
                                className="image_block block-1"
                                role="presentation"
                                width="100%"
                              >
                                <tr>
                                  <td className="pad" style={{ width: '100%' }}>
                                    <div
                                      style={{ alignContent: 'center' }}
                                      className="alignment"
                                    >
                                      <div style={{ maxWidth: ' 166.667px' }}>
                                        <img
                                          src="images/1_Logo.png"
                                          style={{
                                            display: 'block',
                                            height: 'auto',
                                            border: 0,
                                            width: '100%',
                                          }}
                                          width="166.667"
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>

                            <td
                              className="column column-3"
                              style={{
                                fontWeight: '400',
                                textAlign: 'left',
                                paddingBottom: '5px',
                                paddingTop: '5px',
                                verticalAlign: 'top',
                                borderTop: '0px',
                                borderRight: '0px',
                                borderBottom: '0px',
                                borderLeft: '0px',
                              }}
                              width={33.34}
                            >
                              <table
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                className="empty_block block-1"
                                role="presentation"
                                width={'100%'}
                              >
                                <tr>
                                  <td className="pad">
                                    <div></div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                align="center"
                cellPadding="0"
                cellSpacing="0"
                className="row row-2"
                role="presentation"
                style={{ border: 0 }}
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        cellPadding="0"
                        cellSpacing="0"
                        className="row-content stack"
                        role="presentation"
                        style={{
                          borderRadius: 0,
                          color: '#000000',
                          width: '500px',
                          margin: '0 auto',
                        }}
                        width="500"
                      >
                        <tbody>
                          <tr>
                            <td
                              className="column column-1"
                              style={{
                                fontWeight: '400',
                                textAlign: 'left',
                                paddingBottom: '5px',
                                paddingTop: '5px',
                                verticalAlign: 'top',
                                borderTop: '0px',
                                borderRight: '0px',
                                borderBottom: '0px',
                                borderLeft: '0px',
                              }}
                              width="100%"
                            >
                              <table
                                cellPadding="10"
                                cellSpacing="0"
                                className="heading_block block-1"
                                role="presentation"
                                style={{ border: '0' }}
                                width="100%"
                              >
                                <tr>
                                  <td className="pad">
                                    <h1
                                      style={{
                                        margin: '0',
                                        color: '#00286c',
                                        direction: 'ltr',
                                        fontFamily:
                                          "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                                        fontSize: '38px',
                                        fontWeight: '700',
                                        letterSpacing: 'normal',
                                        lineHeight: '120%',
                                        textAlign: 'left',
                                        marginTop: 0,
                                        marginBottom: '0',
                                      }}
                                    >
                                      <span className="tinyMce-placeholder">
                                        Funeral Program is ready to be updated
                                        <br />
                                      </span>
                                    </h1>
                                  </td>
                                </tr>
                              </table>

                              <table
                                cellPadding="10"
                                cellSpacing="0"
                                className="paragraph_block block-2"
                                role="presentation"
                                style={{ wordBreak: 'break-word', border: '0' }}
                                width="100%"
                              >
                                <tr>
                                  <td className="pad">
                                    <div
                                      style={{
                                        color: '#444a5b',
                                        direction: 'ltr',
                                        fontFamily:
                                          "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                                        fontSize: '16px',
                                        fontWeight: '400',
                                        letterSpacing: '0px',
                                        lineHeight: '120%',
                                        textAlign: 'left',
                                      }}
                                    >
                                      <p
                                        style={{
                                          margin: '0',
                                          marginBottom: '16px',
                                        }}
                                      >
                                        Good Day,
                                        <br />
                                        <br />
                                        The funeral program for the late John
                                        Doe is ready to be updated.
                                        <br />
                                        <br />
                                        Please follow the link below to complete
                                        the form:
                                        <br />
                                        <br />
                                        [LINK]
                                      </p>
                                      <p style={{ margin: '0' }}>or</p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                cellPadding="10"
                                cellSpacing="0"
                                className="button_block block-3"
                                role="presentation"
                                style={{ border: '0' }}
                                width="100%"
                              >
                                <tr>
                                  <td className="pad">
                                    <div
                                      className="alignment"
                                      style={{ alignContent: 'center' }}
                                    >
                                      <div
                                        style={{
                                          textDecoration: 'none',
                                          display: 'inline-block',
                                          color: '#ffffff',
                                          backgroundColor: '#00286c',
                                          borderRadius: '4px',
                                          width: 'auto',
                                          borderTop: '0px solid transparent',
                                          fontWeight: '400',
                                          borderRight: '0px solid transparent',
                                          borderBottom: '0px solid transparent',
                                          borderLeft: '0px solid transparent',
                                          paddingTop: '5px',
                                          paddingBottom: '5px',
                                          fontFamily:
                                            "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                                          fontSize: '16px',
                                          textAlign: 'center',
                                          wordBreak: 'keep-all',
                                        }}
                                      >
                                        <span
                                          style={{
                                            paddingLeft: '20px',
                                            paddingRight: '20px',
                                            fontSize: '16px',
                                            display: 'inline-block',
                                            letterSpacing: 'normal',
                                          }}
                                        >
                                          <span
                                            style={{
                                              wordBreak: 'break-word',
                                              lineHeight: '32px',
                                            }}
                                          >
                                            Update Funeral Program
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table
                        align="center"
                        cellPadding="0"
                        cellSpacing="0"
                        className="row row-3"
                        role="presentation"
                        style={{ border: '0' }}
                        width="100%"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <table
                                align="center"
                                cellPadding="0"
                                cellSpacing="0"
                                className="row-content stack"
                                role="presentation"
                                style={{
                                  borderRadius: 0,
                                  color: ' #000000',
                                  width: '500px',
                                  margin: '0 auto',
                                }}
                                width="500"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      className="column column-1"
                                      style={{
                                        fontWeight: '400',
                                        textAlign: 'left',
                                        paddingBottom: '5px',
                                        paddingTop: '5px',
                                        verticalAlign: 'top',
                                        borderTop: '0px',
                                        borderRight: '0px',
                                        borderBottom: '0px',
                                        borderLeft: '0px',
                                      }}
                                      width="100%"
                                    >
                                      <table
                                        cellPadding="10"
                                        cellSpacing="0"
                                        className="paragraph_block block-1"
                                        role="presentation"
                                        style={{
                                          border: '0',
                                          wordBreak: 'break-word',
                                        }}
                                        width="100%"
                                      >
                                        <tr>
                                          <td className="pad">
                                            <div
                                              style={{
                                                color: '#101112',
                                                direction: 'ltr',
                                                fontFamily:
                                                  "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                                                fontSize: '16px',
                                                fontWeight: '400',
                                                letterSpacing: '0px',
                                                lineHeight: '120%',
                                                textAlign: 'left',
                                              }}
                                            >
                                              <p style={{ margin: '0' }}>
                                                Please ensure that all the
                                                details are entered correctly as
                                                we will not be responsible for
                                                any spelling errors and typos.
                                                Once submitted, we see the
                                                program details as confirmed and
                                                will send it through for
                                                printing.
                                                <br />
                                                <br />
                                                Kind Regards,
                                                <br />
                                                Fortuin Funeral Home.
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <style jsx>
        {`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
          }

          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
          }

          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
          }

          p {
            line-height: inherit;
          }

          .desktop_hide,
          .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
          }

          .image_block img + div {
            display: none;
          }

          @media (max-width: 520px) {
            .desktop_hide table.icons-inner {
              display: inline-block !important;
            }

            .icons-inner {
              text-align: center;
            }

            .icons-inner td {
              margin: 0 auto;
            }

            .mobile_hide {
              display: none;
            }

            .row-content {
              width: 100% !important;
            }

            .stack .column {
              width: 100%;
              display: block;
            }

            .mobile_hide {
              min-height: 0;
              max-height: 0;
              max-width: 0;
              overflow: hidden;
              font-size: 0px;
            }

            .desktop_hide,
            .desktop_hide table {
              display: table !important;
              max-height: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};
