import React from "react";
const AddressMap = () => {
  return (
    <div className="google-map-code">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1392.4391814017545!2d83.82543251279886!3d18.288390024055417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3c13503f331c41%3A0xb4212620d053a81f!2sRGUKT%20IIIT%20SKLM!5e0!3m2!1sen!2sin!4v1758213264317!5m2!1sen!2sin"
        width="300"
        height="250"
        frameborder="0"
        style={{ border: 0 }}
        allowfullscreen=""
        aria-hidden="false"
        tabindex="0"
      />
    </div>
  );
};
export { AddressMap };
