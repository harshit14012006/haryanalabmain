import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  container: {
    textAlign: "center",
    color: "#8B4513",
  },
  headerTitle: {
    textDecoration: "underline",
    fontSize: 16,
  },
  headerMain: {
    fontSize: 24,
    fontWeight: "bold",
  },
  address: {
    fontSize: 10,
    fontWeight: "bold",
  },
  contact: {
    fontWeight: "bold",
    fontSize: 10,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "brown",
    margin: "10px 0",
  },
  sectionText: {
    fontSize: 12,
  },
  scrollableTable: {
    padding: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderTop: 2,
    borderBottom: 2,
    paddingVertical: 5,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottom: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  footerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: 2,
    borderBottom: 2,
    // marginTop: 10,
    paddingTop: 10,
    paddingBottom: 5,
    color: "#8B4513",
  },
  totalSamples: {
    textAlign: "right",
    fontSize: 14,
  },
  textcolor: {
    fontSize: 14,
  },
});

const AccountLedger = ({
  Data,
  Balance,
  OpeningBalance,
  Date1,
  Date2,
  PartyName,
  City,
}) => {
  return (
    <Document>
      <Page orientation="landscape" style={styles.page}>
        <View fixed style={styles.container}>
          <Text style={styles.headerTitle}>Account Ledger</Text>
          <Text style={styles.headerMain}>Haryana Laboratory</Text>
          <Text style={styles.address}>
            Suvidha Marg, Corner Gali No.3, Aggarsain Colony, Sirsa-125055
          </Text>
          <Text style={styles.contact}>
            86076-23157, 91833-23157, 94655-37157, 81685-26828
          </Text>
        </View>

        <View fixed style={styles.headerSection}>
          <View>
            <Text style={styles.sectionText}>M/s/Sh.: {PartyName}</Text>
            <Text style={[styles.sectionText, { marginLeft: 3 }]}>{City}</Text>
          </View>
          <View>
            <Text style={styles.sectionText}>
              (FROM {Date1} to {Date2})
            </Text>
            <Text>Opening Balance: {OpeningBalance}</Text>
          </View>
        </View>

        <View style={styles.scrollableTable}>
          <View fixed style={styles.tableHeader}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Type</Text>
            <Text style={styles.tableCell}>Particulars</Text>
            <Text style={styles.tableCell}>Remarks/Narration</Text>
            <Text style={styles.tableCell}>Credit</Text>
            <Text style={styles.tableCell}>Debit</Text>
          </View>

          {Data.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{item.Date}</Text>
              <Text style={styles.tableCell}>
                {item.Reportno !== "null" ? "Rpt" : "Amt"}
              </Text>
              <Text style={styles.tableCell}>
                {item.Reportno !== "null" ? item.Reportno : "Cash"}
              </Text>
              <Text style={styles.tableCell}>{item.Remarks}</Text>
              <Text style={styles.tableCell}>{item.Credit}</Text>
              <Text style={styles.tableCell}>{item.Debit}</Text>
            </View>
          ))}

          <View style={styles.footerSection}>
            <Text style={styles.textcolor}>
              Total Number of Samples: {Data.Count}
            </Text>
            <Text style={styles.totalSamples}>Closing Balance: {Balance}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default AccountLedger;
