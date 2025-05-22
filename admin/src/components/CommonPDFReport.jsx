import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import gymConfig from '../config/gymConfig';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12
  },
  header: {
    marginBottom: 20,
  },
  gymHeader: {
    marginBottom: 15,
    textAlign: 'center',
    borderBottom: '1pt solid #ccc',
    paddingBottom: 10
  },
  gymName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  gymDetails: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 10
  },
  date: {
    fontSize: 10,
    color: 'grey',
    textAlign: 'center'
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginTop: 10
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#bfbfbf",
    borderBottomWidth: 1,
    minHeight: 25
  },
  tableColHeader: {
    borderRightColor: "#bfbfbf",
    borderRightWidth: 1,
    padding: 5,
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  tableCol: {
    borderRightColor: "#bfbfbf",
    borderRightWidth: 1,
    padding: 5
  }
});

const CommonPDFReport = ({ title, data, columns }) => {
  const currentDate = new Date().toLocaleDateString();
  
  const getColumnWidth = (key) => {
    switch (key.toLowerCase()) {
      case 'date':
      case 'time':
      case 'rating':
        return '15%';
      case 'name':
      case 'email':
      case 'category':
        return '20%';
      case 'description':
      case 'review':
      case 'feedback':
      case 'notes':
        return '30%';
      default:
        return `${100 / Object.keys(columns).length}%`;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.gymHeader}>
            <Text style={styles.gymName}>{gymConfig.name}</Text>
            <Text style={styles.gymDetails}>{gymConfig.address}</Text>
            <Text style={styles.gymDetails}>
              {gymConfig.city}, {gymConfig.state} - {gymConfig.pincode}
            </Text>
            <Text style={styles.gymDetails}>
              Phone: {gymConfig.phone} | Email: {gymConfig.email}
            </Text>
            <Text style={styles.gymDetails}>
              Website: {gymConfig.website}
            </Text>
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>Generated on: {currentDate}</Text>
        </View>
        
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            {Object.entries(columns).map(([key, label]) => (
              <View 
                key={key} 
                style={[styles.tableColHeader, { width: getColumnWidth(key) }]}
              >
                <Text>{label}</Text>
              </View>
            ))}
          </View>
          
          {/* Table Data */}
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              {Object.keys(columns).map((key) => (
                <View 
                  key={key} 
                  style={[styles.tableCol, { width: getColumnWidth(key) }]}
                >
                  <Text>{item[key]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export const PDFDownloadButton = ({ title, data, columns, fileName }) => (
  <PDFDownloadLink
    document={<CommonPDFReport title={title} data={data} columns={columns} />}
    fileName={fileName}
    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
  >
    {({ blob, url, loading, error }) =>
      loading ? 'Generating PDF...' : 'Download PDF'
    }
  </PDFDownloadLink>
);

export default CommonPDFReport; 