import * as React from "react";
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";

import { useEffect, useState } from "react";

const Root = styled("div")(
  ({ theme }) => `
  color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
  };
  font-size: 20px;
`
);

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")(
  ({ theme }) => `
  width: 29.6rem;
  border: 1px solid ${theme.palette.mode === "dark" ? "#434343" : "#d9d9d9"};
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 0.7rem;
  &:hover {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
  }

  &.focused {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    color: ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.65)"
        : "rgba(0,0,0,.85)"
    };

    height: 50px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 2.5rem;
  margin: 2px;
  line-height: 22px;
  background-color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#fafafa"
  };
  border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  font-size: 15px;
  width: 480px;
  margin: 2px 0 0;
  margin-left: 0.7rem;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

export default function CustomizedHook({getMedicines}) {

    const [medicines, setMedicines] = useState(top100Films)

    const [selectedMedicines, setSelectedMedicines] = useState([])

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,  
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    // defaultValue: [top100Films[1]],
    multiple: true,
    options: medicines,
    getOptionLabel: (option) => option.name,
    
  });

  

//   useEffect post on http://127.0.0.1:5000/medicines with value
    useEffect (() => {
        // console.log(value)
        if(getInputProps().value.length > 0)
        {
            fetch('http://127.0.0.1:5000/medicines?query=' + getInputProps().value, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.products)
                setMedicines(data.products)
                medicines.push(data.products)
            })
            // Add the selected medicine to the list
            setSelectedMedicines([value])
            // console.log("Seleccccct: ", selectedMedicines)
            getMedicines(selectedMedicines)

        }
        }, [getInputProps().value])
    

    console.log(getInputProps().value)
    

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}
        style ={{
            fontSize: "1.5rem",
            fontWeight: "bold",
        }}
        >Medicine</Label><br></br>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          {value.map((option, index) => (
            <StyledTag label={option.name} {...getTagProps({ index })} />
          ))}

          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li {...getOptionProps({ option, index })}>
              <span>{option.name}</span>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </Listbox>
      ) : null}
    </Root>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    {
        "hubProductId": 6119,
        "imageUrl": "images/resized/Laxoberon-5mg-Sku-3281-F.jpg",
        "maxQuantityPurchase": 1000,
        "name": "Laxoberon 5mg Tablet 10 'S",
        "outOfStock": null,
        "prescriptionRequired": true,
        "price": {
          "actualPrice": 44.27,
          "discountPercentage": 12,
          "discountedPrice": 38.96
        },
        "productId": 3209,
        "productSlug": "laxoberon-5mg-3209",
        "size": "10 Tablet(s)"
      },
      {
        "hubProductId": 31579,
        "imageUrl": "images/resized/Laxoberon-Sku-10002-F.jpg",
        "maxQuantityPurchase": 1000,
        "name": "Laxoberon Liquid 120 ml",
        "outOfStock": null,
        "prescriptionRequired": true,
        "price": {
          "actualPrice": 138.61,
          "discountPercentage": 12,
          "discountedPrice": 121.98
        },
        "productId": 9790,
        "productSlug": "laxoberon-9790",
        "size": "120ml Liquid(s)"
      },
      {
        "hubProductId": 6055,
        "imageUrl": "images/resized/Plazo-250mg-Sku-1081-F.jpg",
        "maxQuantityPurchase": 1000,
        "name": "Plazo 250mg Tablet 6 'S",
        "outOfStock": null,
        "prescriptionRequired": true,
        "price": {
          "actualPrice": 245.0,
          "discountPercentage": 12,
          "discountedPrice": 215.6
        },
        "productId": 956,
        "productSlug": "plazo-250mg-956",
        "size": "6 Tablet(s)"
      },
      {
        "hubProductId": 5285,
        "imageUrl": "images/resized/LaooqSapistan-Sku-2184-F.jpg",
        "maxQuantityPurchase": 1000,
        "name": "Laooq Sapistan Powder 100 gm",
        "outOfStock": null,
        "prescriptionRequired": false,
        "price": {
          "actualPrice": 120.0,
          "discountPercentage": 8,
          "discountedPrice": 110.4
        },
        "productId": 2132,
        "productSlug": "laooq-sapistan-2132",
        "size": "100gm Powder(s)"
      },
      {
        "hubProductId": 6045,
        "imageUrl": "images/resized/Plazo-500mg-Sku-2521-F.jpg",
        "maxQuantityPurchase": 1000,
        "name": "Plazo 500mg Tablet 6 'S",
        "outOfStock": null,
        "prescriptionRequired": true,
        "price": {
          "actualPrice": 420.5,
          "discountPercentage": 12,
          "discountedPrice": 370.04
        },
        "productId": 2455,
        "productSlug": "plazo-500mg-2455",
        "size": "6 Tablet(s)"
      },
      {
        "hubProductId": 6976,
        "imageUrl": "images/resized/Fexo-120mg-Sku-4959-F.jpg",
        "maxQuantityPurchase": 1000,
        "name": "Fexo 120mg Tablet 5 'S",
        "outOfStock": null,
        "prescriptionRequired": true,
        "price": {
          "actualPrice": 230.29,
          "discountPercentage": 12,
          "discountedPrice": 202.66
        },
        "productId": 4531,
        "productSlug": "fexo-120mg-4531",
        "size": "5 Tablet(s)"
      },
      {
        "hubProductId": 6988,
        "imageUrl": "images/resized/Fexo-60mg-Sku-5008-F.jpg",
        "maxQuantityPurchase": 1000,
        "name": "Fexo 60mg Tablet 10 'S",
        "outOfStock": null,
        "prescriptionRequired": true,
        "price": {
          "actualPrice": 133.73,
          "discountPercentage": 12,
          "discountedPrice": 117.68
        },
        "productId": 4565,
        "productSlug": "fexo-60mg-4565",
        "size": "10 Tablet(s)"
      },
      {
        "hubProductId": 52954,
        "imageUrl": "images/resized/Bello-Maxi-Sku-12549-F.jpg",
        "maxQuantityPurchase": 2,
        "name": "Bello Maxi Diaper 70 'S",
        "outOfStock": null,
        "prescriptionRequired": false,
        "price": {
          "actualPrice": 2510.0,
          "discountPercentage": 30,
          "discountedPrice": 1757.0
        },
        "productId": 12796,
        "productSlug": "bello-maxi-12796",
        "size": "70 Diaper(s)"
      },
      {
        "hubProductId": 291461,
        "imageUrl": "images/product-placeholder.png",
        "maxQuantityPurchase": 1000,
        "name": "Lanz 30mg Capsule 7 'S",
        "outOfStock": null,
        "prescriptionRequired": true,
        "price": {
          "actualPrice": 129.0,
          "discountPercentage": 0,
          "discountedPrice": 129.0
        },
        "productId": 25466,
        "productSlug": "lanz-30mg-capsule-14-0-s-25466",
        "size": "7 Capsule(s)"
      },
      {
        "hubProductId": 2315,
        "imageUrl": "images/resized/GenLevo-250mg-Sku-605-F.jpg",
        "maxQuantityPurchase": 1000,
        "name": "Gen-Levo 250mg Tablet 10 'S",
        "outOfStock": null,
        "prescriptionRequired": true,
        "price": {
          "actualPrice": 125.0,
          "discountPercentage": 12,
          "discountedPrice": 110.0
        },
        "productId": 547,
        "productSlug": "gen-levo-250mg-547",
        "size": "10 Tablet(s)"
      }
];
