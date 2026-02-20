const proposalFormConfig = [
    {
        type: "text",
        name: "clientName",
        label: "Client Name",
        placeholder: "Enter client name"
    },
    {
        type: "textarea",
        name: "clientAddress",
        label: "Client Address",
        placeholder: "Enter full address"
    },
    {
        type: "text",
        name: "clientCity",
        label: "City",
        placeholder: "Enter city"
    },
    {
        type: "select",
        name: "propertyType",
        label: "Property Type",
        placeholder: "Select property type",
        options: ["Commercial", "Gated Community", "Residential"]
    },

    // row layout
    {
        type: "row",
        fields: [
            {
                type: "currency",
                name: "clientPowerTariff",
                label: "Client Power Tariff"
            },
            {
                type: "unit",
                name: "plantCapacity",
                label: "Plant Capacity",
                unit: "kW"
            },
            {
                type: "number",
                name: "generationPerDay",
                label: "Estimated Generation Per Day (Units)",
                placeholder: "Units",
                defaultValue: 4
            },
            {
                type: "number",
                name: "costPerKW",
                label: "Project Cost per kW",
                placeholder: "Enter cost",
                prefix: "₹",
                suffix: "kW"
            }
        ]
    },

    {
        type: "row",
        fields: [
            {
                type: "select",
                name: "meterType",
                label: "Meter Type",
                placeholder: "Select meter type",
                options: ["Residential", "Commercial"]
            },
            {
                type: "select",
                name: "projectType",
                label: "Project Type",
                placeholder: "Select project type",
                options: ["BOOT", "EPC", "BOOT + EPC"]
            }
        ]
    },
    {
        type: "currency",
        name: "bootTariff",
        label: "BOOT Tariff",
        showIf: {
            field: "projectType",
            values: ["BOOT", "BOOT + EPC"]
        }
    },
    {
        type: "select",
        name: "contractYears",
        label: "Contract Years",
        placeholder: "Select contract years",
        options: [
            "5 Years",
            "6 Years",
            "7 Years",
            "8 Years",
            "9 Years",
            "10 Years",
            "11 Years",
            "12 Years",
            "13 Years",
            "14 Years",
            "15 Years"
        ],
        showIf: {
            field: "projectType",
            values: ["BOOT", "BOOT + EPC"]
        }
    },
    {
        type: "multi-select",
        name: "inverterMakes",
        label: "Inverter Makes",
        placeholder: "Select inverter makes",
        options: [
            "Sungrow",
            "Huawei",
            "Solis",
            "Growatt",
            "Fronius",
            "Delta",
            "ABB"
        ]
    },
    {
        type: "multi-select",
        name: "panelMakes",
        label: "Panel Makes",
        placeholder: "Select panel makes",
        options: [
            "Waaree",
            "Adani Solar",
            "Tata Power Solar",
            "Vikram Solar",
            "RenewSys",
            "Canadian Solar",
            "JA Solar",
            "Longi"
        ]
    },
    {
        type: "section",
        title: "Solar Panel Details",
        fields: [
            {
                type: "row",
                fields: [
                    {
                        type: "select",
                        name: "panelWattPeak",
                        label: "Solar Panel Watt Peak (Wp)",
                        placeholder: "Select watt peak",
                        options: [570, 580, 590, 610, 630, 670, 700]
                    },
                    {
                        type: "readonly",
                        name: "panelQuantity",
                        label: "Number of Solar Panels"
                    }
                ]
            },

            {
                type: "row",
                fields: [
                    {
                        type: "select",
                        name: "productWarranty",
                        label: "Product Warranty",
                        placeholder: "Years",
                        options: [10, 11, 12, 13, 14, 15]
                    },
                    {
                        type: "select",
                        name: "performanceWarranty",
                        label: "Performance Warranty",
                        placeholder: "Years",
                        options: [15, 16, 17, 18, 19, 20]
                    }
                ]
            },

            {
                type: "select",
                name: "inverterWarranty",
                label: "Inverter Warranty",
                placeholder: "Years",
                options: [7, 8, 9, 10]
            }
        ]
    },
    {
        type: "repeater",
        name: "inverters",
        label: "Inverter Capacity",
        fields: [
            {
                type: "select",
                name: "capacity",
                placeholder: "Select capacity",
                options: [
                    "5kW",
                    "8kW",
                    "10kW",
                    "12kW",
                    "15kW",
                    "20kW",
                    "25kW",
                    "30kW",
                    "50kW",
                    "60kW",
                    "80kW",
                    "100kW",
                    "125kW",
                    "250kW"
                ]
            },
            {
                type: "number",
                name: "quantity",
                placeholder: "Qty"
            }
        ]
    },
    {
        type: "section",
        title: "Proposer Details",
        fields: [
            {
                type: "select",
                name: "proposer",
                label: "Proposer",
                placeholder: "Select proposer",

                // ⭐ mapping inside config
                options: [
                    {
                        label: "Bharath Kumar",
                        value: "Bharath Kumar",
                        phone: "+91 72074 28288"
                    },
                    {
                        label: "Ravi Teja",
                        value: "Ravi Teja",
                        phone: "+91 90000 00000"
                    },
                    {
                        label: "Suresh Kumar",
                        value: "Suresh Kumar",
                        phone: "+91 80000 00000"
                    },
                    {
                        label: "Other",
                        value: "Other"
                    }
                ]
            },

            {
                type: "text",
                name: "customProposerName",
                label: "Custom Name",
                showIf: {
                    field: "proposer",
                    value: "Other"
                }
            },

            {
                type: "text",
                name: "proposerPhone",
                label: "Phone Number"
            }
        ]
    }
];

export default proposalFormConfig;
