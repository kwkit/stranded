namespace :erd do
  desc 'Generate Entity Relationship Diagram'
  task :generate_erd do
    system "erd --inheritance --filetype=dot --direct --attributes=primary_keys,foreign_keys,content,timestamps,inheritance --title=Stranded"
    system "dot -Tpng erd.dot > erd.png"
    File.delete('erd.dot')
  end
end
