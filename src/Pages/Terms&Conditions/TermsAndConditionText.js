import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const TermsAndConditionText = () => {
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem('TokenForSuperAdminOfServiceProvider');
  const baseURL = process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

  
  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/admin/cms/terms_and_conditions`,
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
          toast.error(response?.data?.message || 'Failed to load Terms and Conditions.');
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
        toast.error('Failed to load Terms and Conditions. Please try again.');
      }
    };

    fetchTermsAndConditions();
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
        `${baseURL}/api/admin/cms/terms_and_conditions`,
        {
          title: "Terms and Conditions",  // Ensure you send the title
          content: editorContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response?.data?.success) {
        toast.success('Terms and Conditions updated successfully!');
      } else {
        toast.error(response?.data?.message || 'Failed to update Terms and Conditions.');
      }
    } catch (error) {
      console.error('Error updating terms and conditions:', error);
      toast.error('Failed to update Terms and Conditions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Terms and Conditions</h2>
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
        placeholder="Enter your terms and conditions here..."
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
          {loading ? 'Saving...' : 'Update Terms and Conditions'}
        </Button>
      </div>
    </div>
  );
};

export default TermsAndConditionText;
