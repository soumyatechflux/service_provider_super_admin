
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format,parseISO } from 'date-fns';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 30,
    fontFamily: 'Helvetica',
    position: 'relative',
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
    position: 'absolute',
    textAlign: 'center',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    borderTop: '1 solid #000',
    paddingTop: 4,
  },
  signatureContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    textAlign: 'right',
  },
  smallText: {
    fontSize: 8, // or any size you prefer
  },
});

const formatCurrency = (value) => {
  if (!value) return "0.00";
  const numValue = parseFloat(value) || 0;
  return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const numberToWords = (num) => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return 'Overflow';
    const nNum = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nNum) return;
    let str = '';
    str += (Number(nNum[1]) !== 0) ? (a[Number(nNum[1])] || b[nNum[1][0]] + ' ' + a[nNum[1][1]]) + ' Crore ' : '';
    str += (Number(nNum[2]) !== 0) ? (a[Number(nNum[2])] || b[nNum[2][0]] + ' ' + a[nNum[2][1]]) + ' Lakh ' : '';
    str += (Number(nNum[3]) !== 0) ? (a[Number(nNum[3])] || b[nNum[3][0]] + ' ' + a[nNum[3][1]]) + ' Thousand ' : '';
    str += (Number(nNum[4]) !== 0) ? (a[Number(nNum[4])] || b[nNum[4][0]] + ' ' + a[nNum[4][1]]) + ' Hundred ' : '';
    str += (Number(nNum[5]) !== 0) ? ((str !== '') ? 'and ' : '') +
      (a[Number(nNum[5])] || b[nNum[5][0]] + ' ' + a[nNum[5][1]]) + ' ' : '';
    return str.trim() ;
  };

  return inWords(Math.floor(num));
};

const getFormattedDate = (rawDate) => {
  if (!rawDate) return '';

  try {
    const parsed = parseISO(rawDate); 
    return format(parsed, 'dd MMMM yyyy'); 
  } catch (error) {
    console.error("Date parsing error:", error);
    return rawDate;
  }
};


const PartnerInvoiceDocument = ({ customer }) => {
  if (!customer) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Tax Invoice</Text>

        <View style={styles.row}>
          <View style={styles.address}>
            <Text style={styles.bold}>{customer?.guest_name || "Customer Name"}</Text>
            {/* <Text>Booking ID: {customer?.booking_id || "N/A"}</Text> */}
            <Text>Address: {customer?.visit_address || "N/A"}</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text>Invoice issued by {customer?.issuer_name || "Servyo Powered by Allify Home Solutions Private Limited"}</Text>
            <Text>On behalf of: {customer?.partner?.name || "Servyo Partner"}</Text>
            <Text>{customer?.partner_to_customer?.state || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>Invoice number: {customer?.invoice_number_partner || "N/A"}</Text>
          {/* <Text>Invoice date: {customer?.visit_date || "N/A"}</Text> */}
          <Text>Invoice date: {customer?.invoice_date || "N/A"}</Text>

          <Text>Place of supply (Name of state): {customer?.state_customer || "N/A"}</Text>
          <Text>SAC Code: {customer?.partner_to_customer?.sac_code || "N/A"}</Text>/
          {/* <Text>Category of service: {customer?.category?.category_name || "Services"}</Text> */}
          <Text>
            Tax is payable on reverse charge basis: {customer?.reverse_charge ? "Yes" : "No"}
          </Text>
        </View>


        <View style={styles.table}>
  <View style={styles.tableHeader}>
    <Text style={[styles.cell, { flex: 2 }]}>Tax Point Date</Text>
    <Text style={[styles.cell, { flex: 3 }]}>Description</Text>
    <Text style={styles.cell}>Qty</Text>
    <Text style={styles.cell}>Net Amount</Text>
  </View>

  {[
    {
      date: customer?.tax_date || 'xxx',
      description: `${customer?.category?.category_name || ''}${customer?.sub_category_name?.sub_category_name ? ' - ' + customer.sub_category_name.sub_category_name : ''}`,
      qty: 1,
      amount: customer?.partner_to_customer?.total_amount,
    },
    // {
    //   date: customer?.tax_date || 'xxx',
    //   description: 'Platform Fees',
    //   qty: 1,
    //   amount: customer?.platform_fee,
    // },
    // customer?.partner_to_customer?.tax?.igst && {
    //   date: customer?.tax_date || 'xxx',
    //   description: 'IGST',
    //   qty: '',
    //   amount: customer?.partner_to_customer?.tax?.igst,
    // },
    // customer?.partner_to_customer?.tax?.sgst && {
    //   date: customer?.tax_date || 'xxx',
    //   description: 'SGST',
    //   qty: '',
    //   amount:  customer?.partner_to_customer?.tax?.sgst,
    // },
    // customer?.partner_to_customer?.tax?.cgst && {
    //   date: customer?.tax_date || 'xxx',
    //   description: 'CGST',
    //   qty: '',
    //   amount:  customer?.partner_to_customer?.tax?.cgst,
    // },
  ]
    .filter(Boolean)
    .map((item, index) => (
      <View style={styles.tableRow} key={index}>
      <Text style={[styles.cell, { flex: 2 }]}>
  {customer?.invoice_date}
</Text>


        <Text style={[styles.cell, { flex: 3 }]}>{item.description}</Text>
        <Text style={styles.cell}>{item.qty}</Text>
        <Text style={styles.cell}>{item.amount || '₹0.00'}</Text>
      </View>
  ))}
</View>

<View style={styles.totalSection}>
  {/* <Text>Total net amount: {formatCurrency(customer?.partner_to_customer?.net_amount)}</Text> */}
  {/* <Text>Total Tax: {formatCurrency(customer?.partner_to_customer?.gst)}</Text> */}
  <Text style={styles.bold}>
    Total amount payable: {formatCurrency(customer?.partner_to_customer?.total_amount)}
  </Text>
  {customer?.billing_amount && (
    <Text>({numberToWords(customer?.partner_to_customer?.total_amount)} Rupees Only)</Text>
  )}
</View>


<View style={styles.signatureContainer}>
    <Image
      style={styles.signatureImage}
      src="/Signature/Signature.jpg"
    />
    <Text style={styles.signatureText}>Authorized Signature</Text>
  </View>

          <Text style={styles.footer}>
          <Text style={{ fontWeight: 'bold' }}>
            Allify Home Solutions Private Limited / GST: 07ABCCA1486E1ZW
          </Text>
          {"\n"}
          <Text style={styles.smallText}>
            H no. 5/43, second floor, punjabi bagh road no. 43, punjabi bagh sec-3, west delhi, new delhi, delhi, india, 110026
          </Text>
        </Text>
      </Page>
    </Document>
  );
};

export default PartnerInvoiceDocument;