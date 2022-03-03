import "./index.css";

import React, { Component } from "react";
import Header from "./components/header/Header";
import { render } from "react-dom";
import { Router } from "react-router";
import Routes from "./components/Routes";
import Footer from "./components/footer/Footer"

// Setup history
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

// Setup Toast for Notifications
import { ToastProvider } from "react-toast-notifications";

// Import apollo client for graphql
import { client } from "./apollo";
import { ApolloProvider } from "@apollo/client";
import { Provider as TermProvider } from "./contexts/termContext";
import { Provider as CustomCourseProvider } from "./contexts/customCourseContext";
import { Provider as BottomModeProvider } from "./contexts/bottomModeContext";
import { Provider as CourseSearchProvider } from "./contexts/courseSearchContext";
import { Provider as EmailProvider } from "./contexts/userEmailContext";

// Setup firebase for SAML
import "./firebase";
render(
    <EmailProvider>
        <CourseSearchProvider>
            <BottomModeProvider>
                <CustomCourseProvider>
                    <TermProvider>
                        <ApolloProvider client={client}>
                            <Router history={history}>
                                <ToastProvider>
                                    <Routes />
                                    <Footer />
                                </ToastProvider>
                            </Router>
                        </ApolloProvider>
                    </TermProvider>
                </CustomCourseProvider>
            </BottomModeProvider>
        </CourseSearchProvider>
    </EmailProvider>,
    document.querySelector("#app")
);
