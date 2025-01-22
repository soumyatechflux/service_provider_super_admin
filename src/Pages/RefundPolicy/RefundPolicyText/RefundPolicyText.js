import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const RefundPolicyText = () => {
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem('TokenForSuperAdminOfServiceProvider');
  const baseURL = process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

  // Fetch refund policy content from the API
  useEffect(() => {
    const fetchRefundPolicy = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/admin/cms/refund_policy`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.success) {
          const content = response?.data?.data?.content || '';
          setEditorContent(content);
        } else {
          toast.error(response?.data?.message || 'Failed to load Refund Policy.');
        }
      } catch (error) {
        console.error('Error fetching refund policy:', error);
        toast.error('Failed to load Refund Policy. Please try again.');
      }
    };

    fetchRefundPolicy();
  }, [baseURL, token]);

  const handleChange = (value) => {
    setEditorContent(value);
  };

  const handleSave = async () => {
    if (!editorContent) {
      toast.error('Please enter some text before saving.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        `${baseURL}/api/admin/cms/refund_policy`,
        { 
          title: "Refund policy", 
          content: editorContent 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success('Refund Policy saved successfully!');
      } else {
        toast.error(response?.data?.message || 'Failed to save Refund Policy.');
      }
    } catch (error) {
      console.error('Error saving Refund Policy:', error);
      toast.error('Failed to save Refund Policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Refund Policy</h2>
      <ReactQuill
        value={editorContent}
        onChange={handleChange}
        modules={{
          toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            ['blockquote'],
            [{ align: [] }],
            ['image', 'code-block'],
          ],
        }}
        formats={[
          'header',
          'font',
          'list',
          'bold',
          'italic',
          'underline',
          'link',
          'blockquote',
          'align',
          'image',
          'code-block',
        ]}
        placeholder="Enter your Refund Policy here..."
        style={{ height: '350px', width: '100%' }} 
      />
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          style={{ width: "50%" }}
        >
          {loading ? 'Saving...' : 'Save Refund Policy'}
        </Button>
      </div>
    </div>
  );
};

export default RefundPolicyText;
