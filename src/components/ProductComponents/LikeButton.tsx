import React from "react";
import styled from "styled-components";

interface Props {
  checked: boolean;
  onChange: () => void;
}

const LikeButton = ({ checked, onChange }: Props) => {
  return (
    <StyledWrapper>
      <label className="container">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onChange();
          }}
        />

        <div className="checkmark">
          <svg fill="none" viewBox="0 0 24 24">
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="1.3"
              stroke="#FFFFFF"
              d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"
            />
          </svg>
        </div>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container input {
    position: absolute;
    opacity: 0;
  }

  .container {
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 20px;
  }

  .checkmark {
    height: 1.5em;
    width: 1.5em;
    transition: 100ms;
    animation: dislike_401 400ms ease;
  }

  .container input:checked ~ .checkmark path {
    fill: #1c7dff;
    stroke-width: 1.2;
    stroke: #212121;
  }

  .container input:checked ~ .checkmark {
    animation: like_401 400ms ease;
  }

  .container:hover {
    transform: scale(1.1);
  }

  @keyframes like_401 {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @keyframes dislike_401 {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

export default LikeButton;