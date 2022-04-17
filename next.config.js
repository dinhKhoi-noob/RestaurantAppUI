/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["http://localhost:4000", "apm-bucket-01.s3.us-east-2.amazonaws.com"],
    },
};

module.exports = nextConfig;
