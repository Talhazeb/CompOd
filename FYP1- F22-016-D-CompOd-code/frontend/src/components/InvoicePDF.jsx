import React from "react";
import { useLocation } from "react-router-dom";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    color: "black",
  },
  section: {
    margin: 20,
    padding: 20,
  },
  viewer: {
    width: window.innerWidth - 5,
    height: window.innerHeight - 7,
  },
});

function InvoicePDF() {
  const { state } = useLocation();

  const { data } = state;

  console.log("PDF: ", data);

  // Get name from data from all the invoices
  let name = [];
  let price = [];
  let total = 0;
  const [products, setProduct] = React.useState([]);
  for (let i = 0; i < data[0].length; i++) {
    // var name = data[i].name;
    // console.log(data[0][i].name);
    // console.log(data[0][i].price["actualPrice"]);
    name.push(data[0][i].name);
    price.push(data[0][i].price["actualPrice"]);
    products.push({
      name: data[0][i].name,
      price: data[0][i].price["actualPrice"],
    });
  }

  //   Calculate the sum of all the prices
  for (let i = 0; i < price.length; i++) {
    total += parseFloat(price[i]);
  }

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Invoice
            </Text>
            <Text
              style={{
                fontSize: 15,
                marginTop: 20,
              }}
            >
              {new Date().toDateString()}
            </Text>
            <Text
              style={{
                fontSize: 15,
              }}
            >
              {new Date().toLocaleTimeString()}
            </Text>
            <Image
              src="https://i.ibb.co/3fHcdxD/logo.png"
              style={{
                width: 150,
                height: 150,
                marginLeft: 430,
                marginTop: -100,
              }}
            />

            {/* Map and show it in tabular format */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Products</Text>
              <View style={{ marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottom: 1,
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                  }}
                >
                  <Text
                    style={{ width: 400, fontSize: 15, fontWeight: "bold" }}
                  >
                    Name
                  </Text>
                  <Text
                    style={{ width: 200, fontSize: 15, fontWeight: "bold" }}
                  >
                    Price
                  </Text>
                </View>
                {products.map((product, index) => (
                  <View
                    key={index}
                    style={{ flexDirection: "row", marginTop: 20 }}
                  >
                    <Text style={{ width: 400, fontSize: 15 }}>
                      {product.name}
                    </Text>
                    <Text style={{ width: 200, fontSize: 15 }}>
                      {product.price}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Show a sum of all the prices */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Total</Text>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottom: 1,
                      borderBottomColor: "black",
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text
                      style={{ width: 400, fontSize: 15, fontWeight: "bold" }}
                    >
                      Total
                    </Text>
                    <Text
                      style={{ width: 200, fontSize: 15, fontWeight: "bold" }}
                    >
                      {total}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
export default InvoicePDF;
