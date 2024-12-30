import React from "react";

function Contact() {
  const phone = "1-800-207-777";

  function callNow() {
    window.location.href = `tel:${phone}`;
  }

  return (
    <div>
      <div className="contact-container">
        <div className="contact-box">
          <div className="contact-box-open-days">
            <h3>שעות פעילות</h3>
            <div className="Heading-opening-days">
              <div>
                <h4 className="b">ראשון-חמישי</h4>
                <h4 className="s">9:00-17:00</h4>
              </div>
            </div>
          </div>

          <div className="contact-box-mail">
            <h3>Send us email</h3>
            <div className="Heading-mail">
              <a href="mailto:info@sce.ac.il" className="email-link">
                info@sce.ac.il
              </a>
            </div>
          </div>

          <div className="contact-box-phone">
            <h3>call us</h3>
            <div className="Heading-phone">
              <h5>Doctor Aviad Elishr</h5>
              <button onClick={callNow}>054-487-0000</button>
            </div>
          </div>

          <div className="contact-box-address">
            <h3>address</h3>
            <h5>
              <span style={{ fontWeight: "bolder" }}>באר שבע -</span> ביאליק 56
            </h5>
          </div>
        </div>

        <div className="contact-image">
          <h1>where are we</h1>
          <iframe
            title="Google Map"
            className="iframe"
            src="https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=31.24984,34.7902202&zoom=15"
            width="100%"
            height="400"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
          <h3>or click here</h3>
          <div className="Heading-location">
            <a
              href="https://www.waze.com/ul?ll=32.178485,34.899252&navigate=yes"
              target="_blank"
              rel="noreferrer"
            >
              ביאליק 56, באר שבע, ישראל
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;