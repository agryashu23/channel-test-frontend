import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TermsPage = () => {
  // const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const markdown = `
  Terms of Service for Channels.social App by Chips2Connect Pvt Ltd, effective date: 2023-10-19

## 1. Acceptance of Terms
By accessing or using the Channels app (the "App"), you agree to be bound by these Terms of Service (the "Terms"). If you do not agree to these Terms, you may not access or use the App.

## 2. License to Use
Chips2Connect Pvt Ltd (the "Company") grants you a non-exclusive, personal, non-transferable license to access and use the App for your own personal, non-commercial purposes. You may not use the App for any commercial purpose without the express written consent of the Company.

## 3. Acceptable Use
You agree to use the App in accordance with these Terms and all applicable laws and regulations. You may not use the App for any illegal or unauthorised purpose, including but not limited to:
Violating the copyright, trademark, or other intellectual property rights of any other person or entity;
Transmitting or disseminating any material that is harmful, threatening, abusive, harassing, defamatory, obscene, vulgar, pornographic, or otherwise objectionable;
Engaging in any activity that is intended to interfere with or disrupt the App or any other user's use of the App;
Collecting or storing any personal information about other users without their consent;
Using the App to impersonate any other person or entity; or
Using the App to transmit or distribute any software or other material that contains a virus or other harmful code.

## 4. Prohibited Activities
In addition to the activities listed in Section 3 above, you are also prohibited from using the App for the following purposes:
To engage in any fraudulent or deceptive activity;
To violate the privacy of any other person or entity;
To promote or engage in any illegal or harmful activity;
To interfere with the operation of the App or any other user's use of the App; or
To reverse engineer, disassemble, or decompile the App.

## 5. Termination
The Company may terminate your license to use the App at any time, for any reason, with or without notice. If your license is terminated, you must immediately cease all use of the App.

## 6. Disclaimer of Warranties
THE APP IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. THE COMPANY MAKES NO WARRANTIES, EXPRESS OR IMPLIED, WITH RESPECT TO THE APP, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

## 7. Limitation of Liability
TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APP, EVEN IF THE COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

## 8. Governing Law
These Terms shall be governed by and construed in accordance with the laws of India.

## 9. Entire Agreement
These Terms constitute the entire agreement between you and the Company with respect to your use of the App.

## 10. Changes to Terms
The Company may revise these Terms at any time without notice. If you continue to use the App after any changes have been made to these Terms, you will be deemed to have accepted such changes.

## 11. Contact Information
If you have any questions about these Terms, please contact the Company at reach@chips.social
  `;

  // useEffect(() => {
  //   fetch(
  //     "https://raw.githubusercontent.com/Chips-social/chips-constants/main/terms-of-service.md"
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch Privacy Policy.");
  //       }
  //       return response.text();
  //     })
  //     .then((text) => {
  //       setMarkdown(text);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching markdown file:", err);
  //       setError("Failed to load privacy policy.terms and conditions");
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 text-theme-secondaryText text-primaryText-light">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
        Terms & Conditions
      </h1>

      {/* {loading && <p className="text-center text-sm">Loading...</p>}

      {error && <p className="text-center text-red-500">{error}</p>} */}

      {
        <div className="prose dark:prose text-sm leading-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      }
    </div>
  );
};

export default TermsPage;
