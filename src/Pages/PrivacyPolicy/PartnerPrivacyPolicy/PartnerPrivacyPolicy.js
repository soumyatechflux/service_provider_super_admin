
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const PartnerPrivacyPolicy = () => {
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem('TokenForSuperAdminOfServiceProvider');
  const baseURL = process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

  // Fetch privacy policy content from the API
  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/admin/cms/partner/privacy_policy`,
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
          toast.error(response?.data?.message || 'Failed to load Privacy Policy.');
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        toast.error('Failed to load Privacy Policy. Please try again.');
      }
    };

    fetchPrivacyPolicy();
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
        `${baseURL}/api/admin/cms/partner/privacy_policy`,
        { title: 'Privacy Policy', content: editorContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response?.data?.success) {
        toast.success('Privacy Policy updated successfully!');
      } else {
        toast.error(response?.data?.message || 'Failed to update Privacy Policy.');
      }
    } catch (error) {
      console.error('Error updating privacy policy:', error);
      toast.error('Failed to update Privacy Policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  
  return (
    <div>
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
        placeholder="Enter your privacy policy here..."
        style={{ height: '350px', width: '100%' }} 
      />
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          style={{ width: '50%' }}
        >
          {loading ? 'Saving...' : 'Save Privacy Policy'}
        </Button>
      </div>
    </div>
  );
};

export default PartnerPrivacyPolicy;
