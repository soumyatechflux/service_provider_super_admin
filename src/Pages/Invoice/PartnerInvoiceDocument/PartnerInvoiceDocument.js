
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  address: {
    width: '50%',
    paddingRight: 10,
  },
  invoiceMeta: {
    width: '50%',
    paddingLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
    border: '1 solid #000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    fontWeight: 'bold',
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #ccc',
    paddingVertical: 2,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  totalSection: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  signature: {
    marginTop: 30,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    borderTop: '1 solid #000',
    paddingTop: 4,
  },
});

const PartnerInvoiceDocument = ({ customer }) => {
  if (!customer) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Tax Invoice</Text>

        <View style={styles.row}>
          <View style={styles.address}>
            <Text style={styles.bold}>{customer.guest_name || "Customer Name"}</Text>
            <Text>Booking ID: {customer.booking_id || "N/A"}</Text>
            <Text>Pick up address: {customer.pickup_address || "N/A"}</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text>Invoice issued by {customer.issuer_name || "Uber India Systems Pvt. Ltd."}</Text>
            <Text>On behalf of: {customer.partner_name || "N/A"}</Text>
            <Text>{customer.city_state || "Delhi, IN-DL, India"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>Invoice number: {customer.invoice_number || "N/A"}</Text>
          <Text>Invoice date: {customer.invoice_date || "N/A"}</Text>
          <Text>Place of supply (Name of state): {customer.supply_place || "N/A"}</Text>
          <Text>HSN Code: {customer.hsn_code || "996412"}</Text>
          <Text>Category of service: {customer.service_category || "Passenger Transport Services"}</Text>
          <Text>
            Tax is payable on reverse charge basis: {customer.reverse_charge ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { flex: 2 }]}>Tax Point Date</Text>
            <Text style={[styles.cell, { flex: 3 }]}>Description</Text>
            <Text style={styles.cell}>Qty</Text>
            <Text style={[styles.cell, { flex: 2 }]}>Tax</Text>
            <Text style={styles.cell}>Tax Amount</Text>
            <Text style={styles.cell}>Net amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 2 }]}>{customer.tax_date || "N/A"}</Text>
            <Text style={[styles.cell, { flex: 3 }]}>{customer.description || "Transportation service fare"}</Text>
            <Text style={styles.cell}>{customer.qty || 1}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{customer.tax_type || "CGST 2.5%\nSGST/UTGST 2.5%"}</Text>
            <Text style={styles.cell}>{customer.tax_amount || "₹0.00\n₹0.00"}</Text>
            <Text style={styles.cell}>{customer.net_amount || "₹0.00"}</Text>
          </View>
        </View>

        <View style={styles.totalSection}>
          <Text>Total net amount: ₹{customer.total_net_amount || "0.00"}</Text>
          <Text>Total CGST 2.5%: ₹{customer.cgst || "0.00"}</Text>
          <Text>Total SGST/UTGST 2.5%: ₹{customer.sgst || "0.00"}</Text>
          <Text style={styles.bold}>Total amount payable: ₹{customer.total_amount || "0.00"}</Text>
        </View>

        <Text style={styles.signature}>Authorized Signature</Text>

        <Text style={styles.footer}>
          Details of ECO under GST:
          {"\n"}
          Uber India Systems Private Limited / Private Office No: 205 and 207 (A&B) DBS Business Center, New Delhi, 1st
          Floor, World Trade Tower, Barakhamba Lane, Connaught Place, New Delhi - 110001 | GST: 07AABCU6232H1ZG
        </Text>
      </Page>
    </Document>
  );
};

export default PartnerInvoiceDocument;
