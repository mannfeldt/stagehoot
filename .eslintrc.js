module.exports = {
    "extends": ["airbnb", "react-app"],
    "rules": {
        "linebreak-style": ["error", process.env.NODE_ENV === 'prod' ? "unix" : "windows"],
        "react/jsx-filename-extension": 0,
        "react/forbid-prop-types": 0,
        "react/require-default-props": 0,
        "max-len": ["warn", { "code": 100, "ignoreComments": true }],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "no-continue": 0,


    }
};