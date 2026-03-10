"use client";

import React from "react";
import styled from "styled-components";

interface Props {
  checked: boolean;
  onChange: () => void;
}

export default function LikeButton({ checked, onChange }: Props) {
  return (
    <StyledWrapper
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <label className="container">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onChange();
          }}
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="26"
          width="26"
          className="like"
        >
          <path d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20" />
        </svg>

        <svg width={50} height={50} className="celebrate">
          <polygon points="0,0 10,10" />
          <polygon points="0,25 10,25" />
          <polygon points="0,50 10,40" />
          <polygon points="50,0 40,10" />
          <polygon points="50,25 40,25" />
          <polygon points="50,50 40,40" />
        </svg>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
  }

  .like {
    fill: none;
    stroke: white;
  }

  .container input:checked ~ .like {
    animation: fillLike 0.5s forwards;
  }

  .celebrate {
    position: absolute;
    display: none;
    stroke: white;
  }

  .container input:checked ~ .celebrate {
    display: block;
    animation: celebrate 1s forwards;
  }

  @keyframes celebrate {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1.5) rotate(180deg);
      opacity: 0;
    }
  }

  @keyframes fillLike {
    50% {
      fill: #1e90ff     ;
      stroke: #1e90ff     ;
      transform: scale(1.2);
    }
    100% {
      fill: #dcdcdc  ;
      stroke: #dcdcdc  ;
    }
  }
`;