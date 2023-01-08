import React from "react";
import Faq from "react-faq-component";

const dt = {
    rows: [
        {
            title: "How to use this web app?",
            content: `It can only be used by authorized users. You can login with your username and password. `,
        },
        {
            title: "How can reports be generated?",
            content:
                "For summary report, first live transcription is generated and then it is summarized. For the detailed report, the live transcription is generated and then it is converted to a PDF file. ",
        },
        {
            title: "How can invoices be generated?",
            content: `For invoice generation, first the live transcription is generated and then it is converted to a PDF file. The invoice is generated by extracting the product names and their prices from the live transcription. `,
        },
        {
            title: "What is the package version",
            content: <p>current version is v1.1</p>,
        },
    ],
};

const styles = {
    bgColor: '#fafbfc',
    titleTextColor: "blue",
    rowTitleColor: "#3b9698",
};

export default function FAQ() {    
    return (
        <div>
            <h1>FAQ</h1>
            <Faq
                data={dt}
                styles={styles}
            />
        </div>
    )
}