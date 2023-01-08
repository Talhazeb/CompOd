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
  Svg,
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

function Pdf() {
  const { state } = useLocation();

  const { data } = state;

  console.log("PDF: ", data);
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
              Summary
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

            <Text>{data}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
export default Pdf;
