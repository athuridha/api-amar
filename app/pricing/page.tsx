'use client';

import React from 'react';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-[system-ui]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Choose the potential of your property research with Rumah123 Scraper.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
                    {/* Daily Pass */}
                    <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">Daily Pass (2 Days)</h3>
                            <p className="mt-4 flex items-baseline text-gray-900">
                                <span className="text-5xl font-extrabold tracking-tight">IDR 25k</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500">/one-time</span>
                            </p>
                            <p className="mt-6 text-gray-500">
                                Perfect for quick research or short-term projects.
                            </p>

                            <ul role="list" className="mt-6 space-y-6">
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">48-Hour Access</span>
                                </li>
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">5,000 Data Limit</span>
                                </li>
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">Export CSV & JSON</span>
                                </li>
                            </ul>
                        </div>
                        <a
                            href="https://athuridha.lemonsqueezy.com/checkout/buy/3df82485-538b-4358-b010-fb9f0639afb2"
                            className="mt-8 block w-full bg-blue-50 border border-blue-50 rounded-md py-3 text-sm font-semibold text-blue-700 text-center hover:bg-blue-100"
                        >
                            Buy Daily Pass
                        </a>
                    </div>

                    {/* Monthly Pro */}
                    <div className="relative p-8 bg-white border border-blue-200 rounded-2xl shadow-lg ring-2 ring-blue-500 flex flex-col">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold tracking-wide uppercase text-white shadow-sm">
                                Most Popular
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">Monthly Pro</h3>
                            <p className="mt-4 flex items-baseline text-gray-900">
                                <span className="text-5xl font-extrabold tracking-tight">IDR 100k</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                            </p>
                            <p className="mt-6 text-gray-500">
                                For active agents and serious investors needing continuous data.
                            </p>

                            <ul role="list" className="mt-6 space-y-6">
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">Unlimited Daily Access</span>
                                </li>
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">25,000 Data Limit / Day</span>
                                </li>
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">Priority Support</span>
                                </li>
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">Cancel Anytime</span>
                                </li>
                            </ul>
                        </div>
                        <a
                            href="https://athuridha.lemonsqueezy.com/checkout/buy/c702a184-4c25-4744-9f94-c1dc7bf5efd1"
                            className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-3 text-sm font-semibold text-white text-center hover:bg-blue-700"
                        >
                            Get Monthly Pro
                        </a>
                    </div>

                    {/* Lifetime */}
                    <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">Lifetime License</h3>
                            <p className="mt-4 flex items-baseline text-gray-900">
                                <span className="text-5xl font-extrabold tracking-tight">IDR 500k</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500">/once</span>
                            </p>
                            <p className="mt-6 text-gray-500">
                                Pay once, own it forever. No monthly fees.
                            </p>

                            <ul role="list" className="mt-6 space-y-6">
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">Lifetime Access</span>
                                </li>
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">50,000 Data Limit / Day</span>
                                </li>
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="ml-3 text-gray-500">Included Updates (12mo)</span>
                                </li>
                            </ul>
                        </div>
                        <a
                            href="https://athuridha.lemonsqueezy.com/checkout/buy/fd934a1e-c0a3-44da-8e35-848b6ac991d2"
                            className="mt-8 block w-full bg-blue-50 border border-blue-50 rounded-md py-3 text-sm font-semibold text-blue-700 text-center hover:bg-blue-100"
                        >
                            Buy Lifetime
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
