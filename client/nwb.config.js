module.exports = {
    type: "react-app",
    webpack: {
        define: {
            "process.env.REACT_APP_SERVICE_URL": JSON.stringify(
                // "http://localhost:3001/auth"
                "https://develop-dot-ultrascheduler.uc.r.appspot.com/auth"
            ),
            "process.env.REACT_APP_BACKEND_URL": JSON.stringify(
                "https://api-develop-dot-ultrascheduler.uc.r.appspot.com/api"
            ),
            "process.env.REACT_APP_GRAPHQL_URL": JSON.stringify(
                "https://api-develop-dot-ultrascheduler.uc.r.appspot.com/graphql"
            ),
            "process.env.REACT_APP_GRAPHQL_WS_URL": JSON.stringify(
                "wss://api-develop-dot-ultrascheduler.uc.r.appspot.com/graphql"
            ),
            "process.env.REACT_APP_FIREBASE_API_KEY": JSON.stringify(
                "AIzaSyAypp303rGgCWixsMl3ln-X0sibZ4vwcwY"
            ),
            "process.env.REACT_APP_AUTH_DOMAIN": JSON.stringify(
                "hedwig-279117.firebaseapp.com"
            )
        },
        aliases: {
            cldr$: "cldrjs",
            cldr: "cldrjs/dist/cldr",
        },
    },
};
